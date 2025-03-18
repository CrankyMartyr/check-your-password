import React, { useState } from "react";
import zxcvbn from "zxcvbn";
import sha1 from "sha1";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'

const App = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [pwnedResult, setPwnedResult] = useState("");

  const handleCheckPassword = async () => {
    setResult('');
    setPwnedResult('');
    const analysis = zxcvbn(password);
    const crackTime = analysis.crack_times_display.offline_slow_hashing_1e4_per_second;
    setResult(`Estimated crack time: ${crackTime}`);
    
    const hashedPassword = sha1(password).toUpperCase();
    const prefix = hashedPassword.slice(0, 5);
    const suffix = hashedPassword.slice(5);

    try {
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const data = await response.text();
      const isPwned = data.split("\n").some((line) => line.startsWith(suffix));

      if (isPwned) {
        setPwnedResult("Your password was found in a data breach. Consider changing it!");
      } else {
        setPwnedResult("Your password is safe.");
      }
    } catch (error) {
      setPwnedResult("Error checking password in HIBP. Please try again later.");
    }
  };


  return (
    <div className="container" style={{ fontFamily: "'Nimbus Mono PS', 'Courier New', monospace" }}>
      <h1 className="text-center mt-5" style={{ fontSize: "5rem", color: "#5A3825" }}>
        Is my Password Cooked?
      </h1>
      <div className="mt-5">
        <label htmlFor="password" className="form-label" style={{ fontSize: "1.5rem", color: "#8E5B4C" }}>
          Enter Password:
        </label>
        <input
          type="text"
          id="password"
          className="form-control"
          style={{ backgroundColor: "#eecea0", color: "#5A3825", marginBottom: "1rem" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn btn-dark"
          style={{ backgroundColor: "#8E5B4C", color: "#FFF2E7" }}
          onClick={handleCheckPassword}
        >
          Check Password
        </button>
        {result && (
          <p className="mt-3" style={{ color: "#5A3825", fontSize: "1.2rem" }}>
            {result}
          </p>
        )}
        {pwnedResult && (
          <p className="mt-3" style={{ color: "#5A3825", fontSize: "1.2rem" }}>
            {pwnedResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
