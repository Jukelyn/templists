import {
  Command,
  CommandInput,
  CommandShortcut,
} from "@/components/ui/command";

export default function SearchBar() {
  return (
    <Command className="border-b">
      <div className="mr-2 flex items-center justify-between">
        <CommandInput placeholder="Search for a templist..." />
        <CommandShortcut>⌘K</CommandShortcut>
      </div>
    </Command>
  );
}
