import { Clock } from "lucide-react";

interface Props {
  timestamp: string;
}

const ConditionalTimestamp = ({ timestamp }: Props) => {
  return (
    <>
      {timestamp ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          {`Last change: ${timestamp}`}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default ConditionalTimestamp;
