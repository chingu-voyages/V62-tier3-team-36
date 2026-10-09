export const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string | number;
}) => {
  const firstPayload = payload?.[0];
  const isVisible = active && firstPayload != null;

  return (
    <div
      className="border border-[var(--gray-700)] bg-[var(--white)] px-3 py-2 text-[12px]"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      {isVisible && (
        <>
          <p className="font-bold text-[var(--gray-700)]">{`${label}: $${Number(firstPayload.value).toLocaleString("en-US")}`}</p>
        </>
      )}
    </div>
  );
};
