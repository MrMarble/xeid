import type { Meta, StoryObj } from "@storybook/react";

import Tabs from "./tabs";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="w-1/3 overflow-hidden">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {},
};
