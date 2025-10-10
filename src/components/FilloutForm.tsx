import { useEffect } from 'react';

interface FilloutFormProps {
  height?: string;
  className?: string;
}

const FilloutForm = ({ height = "500px", className = "" }: FilloutFormProps) => {
  useEffect(() => {
    // Load Fillout script if not already loaded
    const scriptId = 'fillout-embed-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://server.fillout.com/embed/v1/';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className={className}>
      <div
        style={{ width: '100%', height }}
        data-fillout-id="stmTaq4XGmus"
        data-fillout-embed-type="standard"
        data-fillout-inherit-parameters
        data-fillout-dynamic-resize
      />
    </div>
  );
};

export default FilloutForm;
