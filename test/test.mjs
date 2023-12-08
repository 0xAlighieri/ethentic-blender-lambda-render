import axios from "axios";

(async () => {
  const stlUrl =
    "https://ethentic.fra1.digitaloceanspaces.com/collection/0/model/model_0.stl";
  const canonicalName = "model_0";
  const traits = { Color: "banana", Shape: "comb" };

  await axios.post(
    "http://localhost:9001/2015-03-31/functions/function/invocations",
    { stlUrl, canonicalName, traits }
  );
})();
