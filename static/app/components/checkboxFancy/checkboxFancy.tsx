import * as React from 'react';
import {css} from '@emotion/react';
import styled from '@emotion/styled';

import {Theme} from 'sentry/utils/theme';

import CheckboxFancyContent from './checkboxFancyContent';

type Props = {
  isDisabled?: boolean;
  size?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
} & React.ComponentProps<typeof CheckboxFancyContent>;

const disabledStyles = (p: Props & {theme: Theme}) =>
  p.isDisabled &&
  css`
    background: ${p.isChecked || p.isIndeterminate
      ? p.theme.gray200
      : p.theme.backgroundSecondary};
    border-color: ${p.theme.border};
  `;

const hoverStyles = (p: Props & {theme: Theme}) =>
  !p.isDisabled &&
  css`
    border: 2px solid
      ${p.isChecked || p.isIndeterminate ? p.theme.active : p.theme.textColor};
  `;

const CheckboxFancy = styled(
  ({isChecked, className, isDisabled, isIndeterminate, onClick}: Props) => (
    <div
      data-test-id="checkbox-fancy"
      role="checkbox"
      aria-disabled={isDisabled}
      aria-checked={isIndeterminate ? 'mixed' : isChecked}
      className={className}
      onClick={onClick}
    >
      <CheckboxFancyContent isIndeterminate={isIndeterminate} isChecked={isChecked} />
    </div>
  )
)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.05) inset;
  width: ${p => p.size};
  height: ${p => p.size};
  border-radius: 5px;
  background: ${p => (p.isChecked || p.isIndeterminate ? p.theme.active : 'transparent')};
  border: 2px solid
    ${p => (p.isChecked || p.isIndeterminate ? p.theme.active : p.theme.gray300)};
  cursor: ${p => (p.isDisabled ? 'not-allowed' : 'pointer')};
  ${p => (!p.isChecked || !p.isIndeterminate) && 'transition: 500ms border ease-out'};

  &:hover {
    ${hoverStyles}
  }

  ${disabledStyles}
`;

CheckboxFancy.defaultProps = {
  size: '16px',
  isChecked: false,
  isIndeterminate: false,
};

export default CheckboxFancy;
