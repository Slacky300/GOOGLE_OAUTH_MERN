import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../helpers/TransactiionFn';
import { getLocalStorageWithExpiry } from '../helpers/auth/authFn';
import { useUpdate } from '../context/hasUpdated';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [users, setUsers] = useState([{}]);
    const token = getLocalStorageWithExpiry('auth')?.token;
    const { setSelectedUser, setActiveForm} = useUpdate();

    useEffect(() => {

        const handleMount = async () => {
            const res = await getAllUsers(token);
            if (res.status === 200) {
                setUsers(res.data);
            }
        }
        handleMount();
    }, []);

    const handleSearch = () => {
        const filteredUsers = users ? users.filter(
            (user) =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.upiId.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];
        setSearchResults(filteredUsers);
    };

    useEffect(() => {
        if (searchTerm.length === 0) return setSearchResults([]);
        handleSearch();
    }, [searchTerm]);

    return (
        <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 card w-100">
            <h3 className="text-center display-6 lead my-4"><i class="bi bi-people"></i> &nbsp; Select receipient</h3>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by email or UPI ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
  
            {searchResults.length > 0 ? (
              <ul className="list-group">
                {searchResults.map((user) => (
                  <li style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedUser(user);
                      setActiveForm(2);
                    }}
                    key={user.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong><i class="bi bi-person-fill"></i>&nbsp;{user.username}</strong> - {user.upiId}
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      Select User
                    </span>
                  </li>
                ))}
              </ul>
            ) : searchTerm.length !== 0 ? (
              <p className="text-center">No results found</p>
            ) : null}
          </div>
        </div>
      </div>
    );
};

export default UserSearch;
