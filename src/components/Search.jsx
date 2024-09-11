import React, { Component, useEffect, useState } from 'react';
import '../components/Search.css'
const Search = () => {

    const [searchInput, SetSearchInput] = useState("")
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUserSet, setSelectedUserSet] = useState(new Set());
    const [activeSuggestion, setActiveSuggestion] = useState(0);

    const[keydownTime, setKeydownTime] = useState('')
    const[keyUpTime, setkeyUpTime] = useState('')





    useEffect(() => {

        const fetchUsers = () => {


            setActiveSuggestion(0);

            if (searchInput.trim() === "") {
                setSuggestions([])
                return
            }


            console.log(searchInput)

            fetch(`https://dummyjson.com/users/search?q=${searchInput}`)
                .then((res) => res.json())
                .then((data) => setSuggestions(data))
                .catch((err) => {
                    console.error(err);
                });

            console.log(suggestions, "suggestions in api call")

        }


     

     
       fetchUsers();

    }, [searchInput])


    const handleSelectedUsers = (users) => {
        // console.log("hiiiiiiiiiiiiiii")
        const newSelectedUsers = [...selectedUsers, users]
        setSelectedUsers(newSelectedUsers);
        setSelectedUserSet(new Set([...selectedUserSet, users.email]));
        SetSearchInput("");
        setSuggestions([])
        console.log(selectedUsers, "selected users")
        console.log(selectedUserSet, "set")


    }

    const handleRemoveUser = (user) => {
        const updatedUsers = selectedUsers.filter(i => i.id !== user.id);
        setSelectedUsers(updatedUsers);

        const updatedEmails = new Set(selectedUserSet);
        updatedEmails.delete(user.email);
        setSelectedUserSet(updatedEmails);
    }


    const handleKeyDown = (e) => {

         setKeydownTime(Date.now())
        if (
            e.key === "Backspace" &&
            e.target.value === "" &&
            selectedUsers.length > 0
        ) {
            const lastUser = selectedUsers[selectedUsers.length - 1];
            handleRemoveUser(lastUser);
            setSuggestions([]);
        } else if (e.key === "ArrowDown" && suggestions?.users?.length > 0) {
            e.preventDefault();
            setActiveSuggestion((prevIndex) =>
                prevIndex < suggestions.users.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp" && suggestions?.users?.length > 0) {
            e.preventDefault();
            setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        } else if (
            e.key === "Enter" &&
            activeSuggestion >= 0 &&
            activeSuggestion < suggestions.users.length
        ) {
            handleSelectedUsers(suggestions.users[activeSuggestion]);
        }
    };

    const handleKeyUp=(e)=>{
     
        setkeyUpTime(Date.now())

    }


    return (
        <div>
            <div className="search-container">

                <div className="chip-container">
                    <div className="pills">
                        {selectedUsers.map((user, index) => (
                            <div key={user.email} className="chips" onClick={() => handleRemoveUser(user)}>
                                <span>{user.firstName} {user.lastName} &times;</span>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className="search-box"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => SetSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                    />
                </div>


                <ul className='suggestionsItem' >

                    {suggestions?.users?.map((users, index) => {
                        return !selectedUserSet?.has(users.email) ? (
                            <li key={users.email} onClick={() => handleSelectedUsers(users)} className={index === activeSuggestion ? "active" : ""}>
                                <span>
                                    {users.firstName} {users.lastName}
                                </span>
                            </li>
                        ) : (<></>)
                    })}

                </ul>
            </div>


        </div>
    );
}

export default Search;