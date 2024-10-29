import React, { useEffect, useState } from 'react';
import '../components/Search.css';
import useDebounce from './hooks/useDebounce';

const Search = () => {
    const [searchInput, SetSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUserSet, setSelectedUserSet] = useState(new Set());
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [keydownTime, setKeydownTime] = useState('');
    const [keyUpTime, setkeyUpTime] = useState('');
    const debouncedInput = useDebounce(searchInput, 500);

    useEffect(() => {
        const fetchUsers = () => {
            setActiveSuggestion(0); // Reset active suggestion index on each fetch

            if (searchInput.trim() === "" || debouncedInput.trim() === "") {
                setSuggestions([]);
                return;
            }

            // Fetch and update suggestions, ensuring the API response is handled correctly
            fetch(`https://dummyjson.com/users/search?q=${debouncedInput}`)
                .then((res) => res.json())
                .then((data) => setSuggestions(data.users || [])) // Update structure here
                .catch((err) => console.error(err));
        };

        fetchUsers();
    }, [debouncedInput]);

    const handleSelectedUsers = (user) => {
        
        if (!selectedUserSet.has(user.email)) {
            const newSelectedUsers = [...selectedUsers, user];
            setSelectedUsers(newSelectedUsers);
            setSelectedUserSet(new Set([...selectedUserSet, user.email]));
        }

        
        SetSearchInput("");
        setSuggestions([]);
        setActiveSuggestion(0);  
    };

    const handleRemoveUser = (user) => {
        const updatedUsers = selectedUsers.filter(i => i.id !== user.id);
        setSelectedUsers(updatedUsers);

        const updatedEmails = new Set(selectedUserSet);
        updatedEmails.delete(user.email);
        setSelectedUserSet(updatedEmails);
    };

    const handleKeyDown = (e) => {
        if (
            e.key === "Backspace" &&
            e.target.value === "" &&
            selectedUsers.length > 0
        ) {
            const lastUser = selectedUsers[selectedUsers.length - 1];
            handleRemoveUser(lastUser);
            setSuggestions([]);
        } else if (e.key === "ArrowDown" && suggestions?.length > 0) {
            e.preventDefault();
            setActiveSuggestion((prevIndex) =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp" && suggestions?.length > 0) {
            e.preventDefault();
            setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
        } else if (
            e.key === "Enter" &&
            activeSuggestion >= 0 &&
            activeSuggestion < suggestions.length
        ) {
            handleSelectedUsers(suggestions[activeSuggestion]);
            
        }
    };

    const handleKeyUp = (e) => {
        setkeyUpTime(Date.now());
    };

    return (
        <div>
            <div className="search-container">
                <div className="chip-container">
                    <div className="pills">
                        {selectedUsers.map((user) => (
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
                <ul className='suggestionsItem'>
                    {suggestions?.map((user, index) => {
                        return !selectedUserSet.has(user.email) ? (
                            <li
                                key={user.email}
                                onClick={() => handleSelectedUsers(user)}
                                className={index === activeSuggestion ? "active" : ""}
                            >
                                <span>{user.firstName} {user.lastName}</span>
                            </li>
                        ) : null;
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Search;
