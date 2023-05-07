import { useEffect, useRef, useState } from "react";
import { useStore } from "../../../hooks/mod.ts";
import { Button, Icon, Tab } from "../atoms/mod.ts";
import { type ITab } from "../atoms/tab.tsx";

interface TabsProps {
  initialTabs?: Array<ITab>;
  initialActiveTab?: string;
  onChange?: (tabs: Array<ITab>, activeTab: string) => void;
}

function newID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default function Tabs({
  initialTabs,
  onChange,
  initialActiveTab,
}: TabsProps) {
  const [tabs, setTabs] = useState(initialTabs ?? [{ id: newID(), title: "" }]);
  const [activeTab, setActiveTab] = useState(
    initialActiveTab ?? (tabs?.[0]?.id || "")
  );
  const { set } = useStore();

  const updateState = async () => {
    await set("tabs", tabs);
    await set("activeTab", activeTab);
  };

  useEffect(() => {
    updateState();
    onChange?.(tabs, activeTab);
    if (tabsRef.current) {
      tabsRef.current.scrollTo({
        left: tabsRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [tabs, activeTab]);

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener("wheel", (event: WheelEvent) => {
        event.preventDefault();
        tabsElement.scrollLeft += event.deltaY || event.deltaX;
      });
    }

    return () => {
      tabsElement?.removeEventListener("wheel", () => {});
    };
  }, []);

  return (
    <div ref={tabsRef} className="flex w-full scrollbar" data-tauri-drag-region>
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
          onDoubleClick={(title) => {
            tab.title = title;
            setTabs([...tabs]);
          }}
          canClose={tabs.length > 1}
        />
      ))}
      <div
        className="flex-grow border-b border-l border-border"
        data-tauri-drag-region
      >
        <Button
          className="h-full px-2 py-0"
          onClick={() => {
            const newTab = { id: newID(), title: "" };
            setTabs([...tabs, newTab]);
            setActiveTab(newTab.id);
          }}
        >
          <Icon name="add" className="text-titlebar" />
        </Button>
      </div>
    </div>
  );
}
