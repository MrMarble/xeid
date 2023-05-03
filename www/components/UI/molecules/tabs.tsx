import { React, tw, useEffect, useState } from "../../../deps.ts";
import { useStore } from "../../../hooks/use-store.ts";
import Add from "../../icons/add.tsx";
import Button from "../atoms/button.tsx";
import Tab, { type ITab } from "../atoms/tab.tsx";

interface TabsProps {
  initialTabs?: Array<ITab>;
  initialActiveTab?: string;
  onChange?: (
    tabs: Array<ITab>,
    activeTab: string,
  ) => void;
}

function newID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default function Tabs(
  { initialTabs, onChange, initialActiveTab }: TabsProps,
) {
  const [tabs, setTabs] = useState(
    initialTabs ?? [{ id: newID(), title: "" }],
  );
  const [activeTab, setActiveTab] = useState(
    initialActiveTab ?? (tabs?.[0]?.id || ""),
  );
  const { set } = useStore();

  const updateState = async () => {
    await set("tabs", tabs);
    await set("activeTab", activeTab);
  };

  useEffect(() => {
    updateState();
    onChange?.(tabs, activeTab);
  }, [tabs, activeTab]);

  return (
    <div className={tw`flex`}>
      {tabs.map((tab, index) => (
        <Tab
          id={tab.id}
          key={tab.id}
          title={tab.title}
          active={activeTab === tab.id}
          onClick={() => {
            setActiveTab(tab.id);
          }}
          onClose={() => {
            const filteredTabs = tabs.filter(({ id }) => id !== tab.id);
            setTabs(filteredTabs);
            if (activeTab === tab.id) {
              setActiveTab(filteredTabs[index - 1]?.id ?? tabs?.[0]?.id);
            }
          }}
          onDoubleClick={() => {
            tab.title = tab.id;
            setTabs([...tabs]);
          }}
          canClose={tabs.length > 1}
        />
      ))}
      <Button
        className={tw`py-0 px-2`}
        onClick={() => {
          const newTab = { id: newID(), title: "" };
          setTabs([...tabs, newTab]);
          setActiveTab(newTab.id);
        }}
      >
        <Add className={tw`text-titlebar`} />
      </Button>
    </div>
  );
}
