import React, { useContext } from "react";
import "./App.css";
import CurrentUserContext from "./context/currentUserContext";
import magic from "./magic";
import * as fcl from "@onflow/fcl";

function App() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  console.log(currentUser);

  const login = async () => {
    //await magic.auth.log({ phoneNumber });
    await magic.auth.loginWithEmailOTP({
      email: "craupeitreiquabra-8580@yopmail.com",
    });

    const metaData = await magic.user.getMetadata();
    setCurrentUser(metaData);
  };

  const logout = async () => {
    await magic.user.logout();
    setCurrentUser(null);
  };

  const AUTHORIZATION_FUNCTION = magic.flow.authorization;

  const transactionExample = async () => {
    if (currentUser == null) {
      alert("Please log in...");
      return;
    }
    const response = await fcl.send([
      fcl.transaction`
      transaction()  {

        prepare(signer: AuthAccount)   {

        }
        execute {
          
        }
      }
    `,
      fcl.proposer(AUTHORIZATION_FUNCTION),
      fcl.authorizations([AUTHORIZATION_FUNCTION]),
      fcl.payer(AUTHORIZATION_FUNCTION),
      fcl.limit(9999),
    ]);
    const transactionData = await fcl.tx(response).onceSealed();

    console.log(transactionData);
    alert("Succesfully ran transaction");
  };

  return (
    <div className="App">
      <header className="App-header">
        {currentUser == null && <button onClick={() => login()}>Log In</button>}
        {currentUser != null && (
          <button onClick={() => logout()}>Log Out</button>
        )}
        <button onClick={() => transactionExample()}>Run Transaction</button>
      </header>
    </div>
  );
}

export default App;
