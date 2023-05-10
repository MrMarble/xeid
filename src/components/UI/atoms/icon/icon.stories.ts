import type { Meta, StoryObj } from '@storybook/react';

import Icon from './icon';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      options: ['add', 'close', 'maximize', 'minimize', 'restore'],
      control: 'select'
    }
  },
} satisfies Meta<typeof Icon>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    name: 'add',
  }
}
