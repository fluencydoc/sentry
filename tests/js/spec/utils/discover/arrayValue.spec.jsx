import {mountWithTheme, screen, userEvent} from 'sentry-test/reactTestingLibrary';

import ArrayValue from 'sentry/utils/discover/arrayValue';

describe('Discover > ArrayValue', function () {
  it('renders an expand link', function () {
    mountWithTheme(<ArrayValue value={['one', 'two', 'three']} />);

    // Should have a button
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('[+2 more]');

    // Should show last value.
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('renders all elements when expanded', function () {
    mountWithTheme(<ArrayValue value={['one', 'two', 'three']} />);

    // Should have a button
    let button = screen.getByRole('button');
    userEvent.click(button);

    // Button text should update.
    button = screen.getByRole('button');
    expect(button).toHaveTextContent('[collapse]');

    // Should show all values.
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('hides toggle on 1 element', function () {
    mountWithTheme(<ArrayValue value={['one']} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('one')).toBeInTheDocument();
  });

  it('hides toggle on 0 elements', function () {
    mountWithTheme(<ArrayValue value={[]} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
