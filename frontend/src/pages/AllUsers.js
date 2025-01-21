// import React, { useEffect, useState } from 'react'
// import SummaryApi from '../common'
// import { toast } from 'react-toastify'
// import moment from 'moment'
// import { MdModeEdit } from "react-icons/md";
// import ChangeUserRole from '../components/ChangeUserRole';

// const AllUsers = () => {
//     const [allUser,setAllUsers] = useState([])
//     const [openUpdateRole,setOpenUpdateRole] = useState(false)
//     const [updateUserDetails,setUpdateUserDetails] = useState({
//         email : "",
//         name : "",
//         role : "",
//         _id  : ""
//     })

//     const fetchAllUsers = async() =>{
//         const fetchData = await fetch(SummaryApi.allUser.url,{
//             method : SummaryApi.allUser.method,
//             credentials : 'include'
//         })

//         const dataResponse = await fetchData.json()

//         if(dataResponse.success){
//             setAllUsers(dataResponse.data)
//         }

//         if(dataResponse.error){
//             toast.error(dataResponse.message)
//         }

//     }

//     useEffect(()=>{
//         fetchAllUsers()
//     },[])

//   return (
//     <div className='bg-white pb-4'>
//         <table className='w-full userTable'>
//             <thead>
//                 <tr className='bg-black text-white'>
//                     <th>Sr.</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Created Date</th>
//                     <th>Action</th>
//                 </tr>
//             </thead>
//             <tbody className=''>
//                 {
//                     allUser.map((el,index) => {
//                         return(
//                             <tr>
//                                 <td>{index+1}</td>
//                                 <td>{el?.name}</td>
//                                 <td>{el?.email}</td>
//                                 <td>{el?.role}</td>
//                                 <td>{moment(el?.createdAt).format('LL')}</td>
//                                 <td>
//                                     <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' 
//                                     onClick={()=>{
//                                         setUpdateUserDetails(el)
//                                         setOpenUpdateRole(true)

//                                     }}
//                                     >
//                                         <MdModeEdit/>
//                                     </button>
//                                 </td>
//                             </tr>
//                         )
//                     })
//                 }
//             </tbody>
//         </table>

//         {
//             openUpdateRole && (
//                 <ChangeUserRole 
//                     onClose={()=>setOpenUpdateRole(false)} 
//                     name={updateUserDetails.name}
//                     email={updateUserDetails.email}
//                     role={updateUserDetails.role}
//                     userId={updateUserDetails._id}
//                     callFunc={fetchAllUsers}
//                 />
//             )      
//         }
//     </div>
//   )
// }

// export default AllUsers

// import React, { useEffect, useState } from 'react';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';
// import moment from 'moment';
// import { MdModeEdit } from 'react-icons/md';
// import ChangeUserRole from '../components/ChangeUserRole';

// const AllUsers = () => {
//   const [allUsers, setAllUsers] = useState([]);
//   const [openUpdateRole, setOpenUpdateRole] = useState(false);
//   const [updateUserDetails, setUpdateUserDetails] = useState(null); // Use `null` as the initial value

//   const fetchAllUsers = async () => {
//     try {
//       const response = await fetch(SummaryApi.allUser.url, {
//         method: SummaryApi.allUser.method,
//         credentials: 'include',
//       });

//       const data = await response.json();

//       if (data.success) {
//         setAllUsers(data.data);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch users.');
//       console.error('Fetch All Users Error:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   const handleUpdateRoleClick = (user) => {
//     setUpdateUserDetails(user); // Set the selected user details
//     setOpenUpdateRole(true);   // Open the role update modal
//   };

//   return (
//     <div className="bg-white pb-4">
//       <table className="w-full userTable">
//         <thead>
//           <tr className="bg-black text-white">
//             <th>Sr.</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Created Date</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {allUsers.map((user, index) => (
//             <tr key={user._id}> {/* Add a unique key for better rendering */}
//               <td>{index + 1}</td>
//               <td>{user?.name}</td>
//               <td>{user?.email}</td>
//               <td>{user?.role}</td>
//               <td>{moment(user?.createdAt).format('LL')}</td>
//               <td>
//                 <button
//                   className="bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
//                   onClick={() => handleUpdateRoleClick(user)} // Pass the selected user
//                 >
//                   <MdModeEdit />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {openUpdateRole && updateUserDetails && (
//         <ChangeUserRole
//           onClose={() => setOpenUpdateRole(false)} // Close the modal
//           name={updateUserDetails.name}
//           email={updateUserDetails.email}
//           role={updateUserDetails.role}
//           userId={updateUserDetails._id}
//           callFunc={fetchAllUsers} // Refresh user list after updating
//         />
//       )}
//     </div>
//   );
// };

// export default AllUsers;

import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEdit } from 'react-icons/md';
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    perPage: 10,
  });

  const fetchAllUsers = async (page = 1) => {
    try {
      const response = await fetch(`${SummaryApi.allUser.url}?page=${page}`, {
        method: SummaryApi.allUser.method,
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setAllUsers(data.data);
        setPagination(data.pagination); // Update pagination details
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch users.');
      console.error('Fetch All Users Error:', error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUpdateRoleClick = (user) => {
    setUpdateUserDetails(user);
    setOpenUpdateRole(true);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      fetchAllUsers(pageNumber);
    }
  };

  return (
    <div className="bg-white pb-4">
      <table className="w-full userTable">
        <thead>
          <tr className="bg-black text-white">
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{(pagination.currentPage - 1) * pagination.perPage + index + 1}</td>
              <td>{user?.name}</td>
              <td>{user?.email}</td>
              <td>{user?.role}</td>
              <td>{moment(user?.createdAt).format('LL')}</td>
              <td>
                <button
                  className="bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white"
                  onClick={() => handleUpdateRoleClick(user)}
                >
                  <MdModeEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          className={`mx-1 px-3 py-1 rounded ${
            pagination.currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          disabled={pagination.currentPage === 1}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: pagination.totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              pagination.currentPage === i + 1 ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          className={`mx-1 px-3 py-1 rounded ${
            pagination.currentPage === pagination.totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>

      {openUpdateRole && updateUserDetails && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={() => fetchAllUsers(pagination.currentPage)}
        />
      )}
    </div>
  );
};

export default AllUsers;

