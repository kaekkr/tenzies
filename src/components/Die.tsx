const Die = ({
  id,
  value,
  isHeld,
  holdDice,
}: {
  id: string;
  value: number;
  isHeld: boolean;
  holdDice: (id: string) => void;
}) => {
  const styles: { backgroundColor: string } = {
    backgroundColor: isHeld ? "#4ade80" : "white",
  };

  return (
    <div className="cursor-pointer rounded-md" style={styles} onClick={() => holdDice(id)}>
      <img className="w-10 h-10" src={`/die${value}.png`} alt="" />
    </div>
  );
};

export default Die;
