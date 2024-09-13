export function Loader() {
    return (
      <div className="flex justify-center items-center">
        <div style={{
          borderColor: 'hsl(var(--secondary))',
          marginLeft:"10px",
        }} className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }