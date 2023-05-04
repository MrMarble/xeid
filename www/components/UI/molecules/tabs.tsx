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
    if (tabsRef.current) {
      console.log(tabsRef.current.scrollWidth);
      tabsRef.current.scrollTo({
        left: tabsRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [tabs, activeTab]);

  const tabsRef = React.useRef<HTMLDivElement>(null);

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
    <div
      ref={tabsRef}
      className={"scrollbar " + tw`flex w-full`}
      data-tauri-drag-region
    >
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
      <div className={tw`flex-grow border(border b-2)`} data-tauri-drag-region>
        <Button
          className={tw`py-0 px-2 h-full`}
          onClick={() => {
            const newTab = { id: newID(), title: "" };
            setTabs([...tabs, newTab]);
            setActiveTab(newTab.id);
          }}
        >
          <Add className={tw`text-titlebar`} />
        </Button>
      </div>
    </div>
  );
}
