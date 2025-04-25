import {
  Command,
  CommandInput,
  CommandShortcut,
} from "@/components/ui/command";

interface Props {
  handleClick: () => void;
}

export default function SearchBar({ handleClick }: Props) {
  return (
    <Command className="border-b" onClick={handleClick}>
      <div className="mr-2 flex items-center justify-between">
        <CommandInput
          placeholder="Search for a templist..."
          readOnly // Use CommandMenu instead
        />
        <CommandShortcut>⌘K</CommandShortcut>
      </div>
    </Command>
  );
}
