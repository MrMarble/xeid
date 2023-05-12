import type { Meta, StoryObj } from "@storybook/react";

import WindowControls from "./window-controls";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Molecules/WindowControls",
  component: WindowControls,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof WindowControls>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {},
};
