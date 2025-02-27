import * as React from 'react';
import {components} from 'react-select';

import SelectControl from 'sentry/components/forms/selectControl';
import IdBadge from 'sentry/components/idBadge';
import {t} from 'sentry/locale';
import {Project} from 'sentry/types';
import InputField from 'sentry/views/settings/components/forms/inputField';

const defaultProps = {
  avatarSize: 20,
  placeholder: t('Choose Sentry project'),
};

// projects can be passed as a direct prop as well
type Props = {projects?: Project[]} & InputField['props'];

type RenderProps = {
  projects: Project[]; // can't use AvatarProject since we need the ID
} & Omit<Partial<Readonly<typeof defaultProps>>, 'placeholder'> &
  Props;

class RenderField extends React.Component<RenderProps> {
  static defaultProps = defaultProps;

  // need to map the option object to the value
  handleChange = (
    onBlur: Props['onBlur'],
    onChange: Props['onChange'],
    optionObj: {value: any},
    event: React.MouseEvent
  ) => {
    const {value} = optionObj;
    onChange?.(value, event);
    onBlur?.(value, event);
  };

  render() {
    const {projects, avatarSize, onChange, onBlur, ...rest} = this.props;

    const projectOptions = projects.map(({slug, id}) => ({value: id, label: slug}));

    const customOptionProject = projectProps => {
      const project = projects.find(proj => proj.id === projectProps.value);
      // shouldn't happen but need to account for it
      if (!project) {
        return <components.Option {...projectProps} />;
      }
      return (
        <components.Option {...projectProps}>
          <IdBadge
            project={project}
            avatarSize={avatarSize}
            displayName={project.slug}
            avatarProps={{consistentWidth: true}}
          />
        </components.Option>
      );
    };

    const customValueContainer = containerProps => {
      const selectedValue = containerProps.getValue()[0];
      const project = projects.find(proj => proj.id === selectedValue?.value);
      // shouldn't happen but need to account for it
      if (!project) {
        return <components.ValueContainer {...containerProps} />;
      }
      return (
        <components.ValueContainer {...containerProps}>
          <IdBadge
            project={project}
            avatarSize={avatarSize}
            displayName={project.slug}
            avatarProps={{consistentWidth: true}}
          />
        </components.ValueContainer>
      );
    };

    return (
      <SelectControl
        options={projectOptions}
        components={{
          Option: customOptionProject,
          SingleValue: customValueContainer,
        }}
        {...rest}
        onChange={this.handleChange.bind(this, onBlur, onChange)}
      />
    );
  }
}

const SentryProjectSelectorField = (props: Props) => (
  <InputField
    {...props}
    field={(renderProps: RenderProps) => <RenderField {...renderProps} />}
  />
);

export default SentryProjectSelectorField;
