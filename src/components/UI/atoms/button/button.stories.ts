import type { Meta, StoryObj } from '@storybook/react';

import Button from './button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    children: 'Button',
  }
}
