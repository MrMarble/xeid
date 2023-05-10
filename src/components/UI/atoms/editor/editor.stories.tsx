import type { Meta, StoryObj } from "@storybook/react";

import Editor from "./editor";

const meta = {
  title: "Atoms/Editor",
  component: Editor,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: ["OneDark", "vs-dark", "light"],
    },
    onMount: { action: "onMount" },
    onChange: { action: "onChange" },
  },
  decorators: [
    (Story) => (
      <div className="flex h-80 w-1/2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Editor>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    theme: "OneDark",
    value: 'const hello = () => "Hello World!";\n\nhello();',
  },
};
