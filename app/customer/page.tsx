export default function CustomerBaseError() {
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200 ease-(--ease-out)">
      <img
        src="/qr-scanner-logo.png"
        alt="TableTap QR Scanner"
        className="w-28 h-28 object-contain mb-6 drop-shadow-[0_10px_22px_rgba(11,59,54,0.18)]"
      />
      <h1 className="font-heading text-2xl uppercase  text-secondary-foreground mb-3">
        Table Required
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
        Please scan the QR code located on your table to access the menu and place your order.
      </p>
    </div>
  )
}
