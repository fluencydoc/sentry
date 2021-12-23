from celery import Celery
from celery.app.task import Task
from celery.worker.request import Request
from django.conf import settings

from sentry.utils import metrics

DB_SHARED_THREAD = """\
DatabaseWrapper objects created in a thread can only \
be used in that same thread.  The object with alias '%s' \
was created in thread id %s and this is thread id %s.\
"""


def patch_thread_ident():
    """
    .. function: patch_thread_ident()

        If the `django.db.backends` module is available, patches it's
        `BaseDatabaseWrapper` class to check that
    different threads are not accessing
        the same database connection concurrently by using thread identifieres.

        This code is based on Django 1.3
    version of this method and should work with
        any recent version of Django back as far as it supports Python 2 (which was released in 2008).
    * If :mod:`django.db.backends` is not available, nothing happens - no error raised, no traceback generated; just nothing happens (no exception
    thrown). This allows one to specify a custom database backend that doesn't use Django but still hooks into pycassa's connection pooling system
    properly and so works fine with pycassa without having to monkey-patch anything or modify any settings etc.; see :attr:`.pool._configure_pool`.
    * If :mod:`django.db.backends`, but the required classes are missing from its namespace then again nothing happens - no error raised, no traceback
    generated; just nothing happens (no exception thrown). This allows one to
    """
    # monkey patch django.
    # This patch make sure that we use real threads to get the ident which
    # is going to happen if we are using gevent or eventlet.
    # -- patch taken from gunicorn
    if getattr(patch_thread_ident, "called", False):
        return
    try:
        from django.db.backends import BaseDatabaseWrapper, DatabaseError

        if "validate_thread_sharing" in BaseDatabaseWrapper.__dict__:
            import _thread as thread

            _get_ident = thread.get_ident

            __old__init__ = BaseDatabaseWrapper.__init__

            def _init(self, *args, **kwargs):
                __old__init__(self, *args, **kwargs)
                self._thread_ident = _get_ident()

            def _validate_thread_sharing(self):
                """
                Validate that the connection isn't accessed by another thread than the one which originally created it, unless `allow_thread_sharing` was enabled.
                """
                if not self.allow_thread_sharing and self._thread_ident != _get_ident():
                    raise DatabaseError(
                        DB_SHARED_THREAD % (self.alias, self._thread_ident, _get_ident())
                    )

            BaseDatabaseWrapper.__init__ = _init
            BaseDatabaseWrapper.validate_thread_sharing = _validate_thread_sharing

        patch_thread_ident.called = True
    except ImportError:
        pass


patch_thread_ident()


class SentryTask(Task):
    Request = "sentry.celery:SentryRequest"

    def apply_async(self, *args, **kwargs):
        with metrics.timer("jobs.delay", instance=self.name):
            return Task.apply_async(self, *args, **kwargs)


class SentryRequest(Request):
    def __init__(self, message, **kwargs):
        super().__init__(message, **kwargs)
        self._request_dict["headers"] = message.headers


class SentryCelery(Celery):
    task_cls = SentryTask


app = SentryCelery("sentry")
app.config_from_object(settings)
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

from sentry.utils.monitors import connect

connect(app)
