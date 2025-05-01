import "./styles.css";
import { useEffect, useReducer, useState } from "react";
import { Button, Card, CardContent, TextField, Typography, Box } from "@mui/material";
import usersData from "./data";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  age: number;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

type SimplifiedUser = {
  id: string;
  username: string;
  address: string;
  age: number;
  companyName: string;
};

type CountState = {
  count: number;
};

type Action =
  | { type: "increment" }
  | { type: "decrementBy"; payload: number }
  | { type: "incrementRandom" }
  | { type: "incrementToOdd" }
  | { type: "reset" }

function generateRandomId(): string {
  const chars = "ABCDEF123456";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function reducer(state: CountState, action: Action): CountState {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrementBy": {
      const newCount = Math.max(state.count - action.payload, 0);
      return { count: newCount };
    }
    case "incrementRandom": {
      const random = Math.floor(Math.random() * 10) + 1;
      return { count: state.count + random };
    }
    case "incrementToOdd": {
      const nextOdd = state.count % 2 === 0 ? state.count + 1 : state.count + 2;
      return { count: nextOdd };
    }
    case "reset":
      return { count: 0 };

    default:
      throw new Error("Unknown action");
  }
}


/** Instructions
   0. Fork this codesandbox and sync it with your github 
   1. import users data from data.ts
   1.1. Utilize TypeScript in your implementation
   2. On load:
   2.1. Filter the users data array to only include users where age >= 18
   2.2. Map the users data array to only include username, address, age and companyName
   2.3. Add a new ID to each user object, which should consist of a randomized sequence (6 characters) of the following: {ABCDEF123456}
   2.4. Sort the array (asc) by age, then by companyName
   2.5. Dispatch the data to the local users state
   3. Display the users' properties using a loop in the tsx, preferably in a styled "Card" form
   3.1. Add a "remove" button to each card - this should remove the user from the state
   3.2. Store the removed users in a new state instance
   3.3. Using the second input, add a method to search for a user's username with the onChange event
   3.4. The removed users should also be found if the input is being used to search for a username
   3.5. In the case where a removed user is shown during a search, there should be a "restore" button, which would insert the removed user back into the users array
   4. Extend the reducer:
   4.1. Count must always be >= 0, in all cases
   4.2. Add a case to increment count with a random number, between 1 and 10
   4.3. Add a case to increment to the nearest odd number, if already odd - increment to next odd
   4.4. Add a case to decrease the count by the input of the first textfield
   4.5. Add a case to reset the count
   4.6. Add buttons to said cases
   4.7. Add styling using MUI
   5. Provide the link to your forked repo with your answers
   */




export default function App() {
  const [users, setUsers] = useState<SimplifiedUser[]>([]);
  const [removedUsers, setRemovedUsers] = useState<SimplifiedUser[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [numberInput, setNumberInput] = useState<number>(0);
  const [countState, dispatch] = useReducer(reducer, { count: 0 });

  useEffect(() => {
    const filtered = usersData
      .filter((u: User) => u.age >= 18)
      .map((u: User) => ({
        id: generateRandomId(),
        username: u.username,
        address: `${u.address.city}, ${u.address.street}`,
        age: u.age,
        companyName: u.company.name
      }))
      .sort((a, b) => a.age - b.age || a.companyName.localeCompare(b.companyName));

    setUsers(filtered);
  }, []);

  const displayedUsers = [...users, ...removedUsers]
    .filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()));

  const isRemoved = (user: SimplifiedUser) => removedUsers.some(u => u.id === user.id);

  const removeUser = (id: string) => {
    const toRemove = users.find(u => u.id === id);
    if (toRemove) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setRemovedUsers(prev => [...prev, toRemove]);
    }
  };

  const restoreUser = (id: string) => {
    const toRestore = removedUsers.find(u => u.id === id);
    if (toRestore) {
      setRemovedUsers(prev => prev.filter(u => u.id !== id));
      setUsers(prev => [...prev, toRestore]);
    }
  };

  return (
    <div className="App">
      <Typography variant="h4">Count: {countState.count}</Typography>
      <TextField
        type="number"
        label="Decrease by"
        value={numberInput}
        onChange={(e) => setNumberInput(Number(e.target.value))}
        style={{ marginBottom: 10 }}
      />
      <Box display="flex" gap={1} justifyContent="center" mb={4}>
        <Button variant="contained" onClick={() => dispatch({ type: "decrementBy", payload: numberInput })}>-</Button>
        <Button variant="contained" onClick={() => dispatch({ type: "increment" })}>+</Button>
        <Button variant="contained" onClick={() => dispatch({ type: "incrementRandom" })}>Random +</Button>
        <Button variant="contained" onClick={() => dispatch({ type: "incrementToOdd" })}>Next Odd</Button>
        <Button variant="contained" onClick={() => dispatch({ type: "reset" })}>Reset</Button>

      </Box>

      <Typography>Search for a user</Typography>
      <TextField
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 30 }}
      />

      {displayedUsers.map(user => (
        <Card key={user.id} style={{ margin: 10, backgroundColor: isRemoved(user) ? '#f5f5f5' : 'white' }}>
          <CardContent>
            <Typography variant="h6">Username: {user.username}</Typography>
            <Typography>Age: {user.age}</Typography>
            <Typography>Address: {user.address}</Typography>
            <Typography>Company: {user.companyName}</Typography>
            <Button
              variant="contained"
              color={isRemoved(user) ? "success" : "error"}
              onClick={() => isRemoved(user) ? restoreUser(user.id) : removeUser(user.id)}
              style={{ marginTop: 10 }}
            >
              {isRemoved(user) ? "Restore" : "Remove"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
