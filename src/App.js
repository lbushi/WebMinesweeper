import { useState } from "react";
import Grid from "./components/Grid";
function App() {
  let [level, setLevel] = useState(6);
  return (
    <Grid size="16" level={level}></Grid>
  );
}

export default App;
