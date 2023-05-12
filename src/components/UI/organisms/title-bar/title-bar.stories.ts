import type { Meta, StoryObj } from "@storybook/react";

import TitleBar from "./title-bar";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Organisms/TitleBar",
  component: TitleBar,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof TitleBar>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    children: "Title Bar",
  },
};
