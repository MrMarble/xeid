import type { Meta, StoryObj } from "@storybook/react";
import { NIL } from "uuid";

import Tab from "./tab";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Molecules/Tab",
  component: Tab,
  tags: ["autodocs"],
  argTypes: {
    onDoubleClick: {
      action: "double clicked",
    },
    onClick: {
      action: "clicked",
    },
    onClose: {
      action: "closed",
    },
  },
} satisfies Meta<typeof Tab>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    id: NIL,
    title: "Tab 1",
    canClose: true,
    active: false,
  },
};
