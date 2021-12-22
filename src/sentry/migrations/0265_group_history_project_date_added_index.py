# Generated by Django 2.2.24 on 2021-12-22 02:11

from django.db import migrations


class Migration(migrations.Migration):
    # This flag is used to mark that a migration shouldn't be automatically run in
    # production. We set this to True for operations that we think are risky and want
    # someone from ops to run manually and monitor.
    # General advice is that if in doubt, mark your migration as `is_dangerous`.
    # Some things you should always mark as dangerous:
    # - Large data migrations. Typically we want these to be run manually by ops so that
    #   they can be monitored. Since data migrations will now hold a transaction open
    #   this is even more important.
    # - Adding columns to highly active tables, even ones that are NULL.
    is_dangerous = True

    # This flag is used to decide whether to run this migration in a transaction or not.
    # By default we prefer to run in a transaction, but for migrations where you want
    # to `CREATE INDEX CONCURRENTLY` this needs to be set to False. Typically you'll
    # want to create an index concurrently when adding one to an existing table.
    # You'll also usually want to set this to `False` if you're writing a data
    # migration, since we don't want the entire migration to run in one long-running
    # transaction.
    atomic = False

    dependencies = [
        ("sentry", "0264_use_booleanfield_docintegration"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    """
                    CREATE INDEX CONCURRENTLY "sentry_grouphistory_project_id_date_added_7e6f676f_idx" ON "sentry_grouphistory" ("project_id", "date_added");
                    """,
                    reverse_sql="""
                    DROP INDEX CONCURRENTLY IF EXISTS sentry_grouphistory_project_id_date_added_7e6f676f_idx;""",
                    hints={"tables": ["sentry_grouphistory"]},
                ),
            ],
            state_operations=[
                migrations.AlterIndexTogether(
                    name="grouphistory",
                    index_together={
                        ("group", "status"),
                        ("project", "status", "release"),
                        ("project", "date_added"),
                    },
                ),
            ],
        )
    ]
