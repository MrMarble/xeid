import type { Meta, StoryObj } from "@storybook/react";

import EditableLabel from "./editable-label";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Atoms/EditableLabel",
  component: EditableLabel,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof EditableLabel>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    text: "Editable Label",
  },
};
