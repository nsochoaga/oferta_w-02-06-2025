import { useEffect, useRef, useState } from "react";

const CardPayment = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const loadScript = async () => {
      if (!formRef.current || cargado) return;

      // Datos dinámicos
      const publicKey = "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7";
      const currency = "COP";
      const amountInCents = 4950000;
      const reference = "REF_" + Date.now();
      let data;
      // Llamar backend para obtener firma
      try {
        const res = await fetch(
          `http://localhost:3000/payment/integrity-hash?reference=${reference}&amount=${amountInCents}&currency=${currency}`
        );
        data = await res.json();
        console.log("Datos de firma:", data);
      } catch (error) {
        console.error("Error generando hash de integridad:", error);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.co.uat.wompi.dev/widget.js";
      script.async = true;
      script.setAttribute("data-render", "button");
      script.setAttribute("data-public-key", publicKey);
      script.setAttribute("data-currency", currency);
      script.setAttribute("data-amount-in-cents", amountInCents.toString());
      script.setAttribute("data-reference", reference);
      script.setAttribute("data-signature:integrity", data.hash);
      script.setAttribute(
        "data-redirect-url",
        "http://localhost:5173/payment-result"
      );

      formRef.current.innerHTML = ""; // Limpiar scripts viejos
      formRef.current.appendChild(script);
      setCargado(true);
    };

    loadScript();
  }, [cargado]);

  return (
    <div>
      <h2>Pago con Wompi</h2>
      <form ref={formRef} />
    </div>
  );
};

export default CardPayment;

// https://checkout.co.uat.wompi.dev/l/stagtest_VPOS_JNl6aX
