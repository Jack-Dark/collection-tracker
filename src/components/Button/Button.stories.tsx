import type { Meta, StoryObj } from '@storybook/tanstack-react';

import SettingsIcon from '@mui/icons-material/Settings';
import { fn } from 'storybook/test';

import { Button, buttonVariants } from '#/components/Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: {
    onClick: fn(),
    text: 'Button',
  },
  // More on argTypes: https://storybook.js.org/docs/api/arg-types#argtypes
  argTypes: {
    type: {
      control: 'radio',
    },
  },
  component: Button,
  title: 'Button',
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Monochromatic: Story = {
  args: {
    variant: 'mono',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Alert: Story = {
  args: {
    variant: 'alert',
  },
};

export const Variants: Story = {
  args: {},
  decorators: [
    (_Story, { args: { children: _children, ...props } }) => {
      return (
        <div className="flex gap-2 items-center">
          {buttonVariants.map((variant) => {
            return (
              <Button
                {...props}
                key={variant}
                text={variant}
                variant={variant}
              />
            );
          })}
        </div>
      );
    },
  ],
};

export const Sizes: Story = {
  args: {
    Icon: <SettingsIcon />,
  },
  decorators: [
    (_Story, { args: { children: _children, ...props } }) => {
      return (
        <div className="flex gap-2 items-center">
          <Button {...props} size="xs" text="xs size" />
          <Button {...props} size="sm" text="sm size" />
          <Button {...props} size="md" text="md size" />
          <Button {...props} size="lg" text="lg size" />
          <Button {...props} size="xl" text="xl size" />
          <Button {...props} size="2xl" text="2xl size" />
        </div>
      );
    },
  ],
};
