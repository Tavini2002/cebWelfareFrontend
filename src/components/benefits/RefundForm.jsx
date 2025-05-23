import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants";
import toast from "react-hot-toast";

const RefundForm = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    epf: "",
    amount: "",
    reason: "",
    message: "",
  });

  const fetchMembers = async () => {
    try {
      const memberFetch = await axios.get(`${BASE_URL}/api/members`, {
        withCredentials: true,
      });

      setMembers(memberFetch.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/api/refunds`, formData, {
        withCredentials: true,
      });
      toast.success("Form submitted successfully");
      setFormData({
        epf: "",
        amount: "",
        reason: "",
        message: "",
      });
    } catch (error) {
      toast.error("There was an error submitting the form.");
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="epf" className="block text-sm font-medium mb-1">
            EPF Number
          </label>
          <input
            type="text"
            id="epf"
            name="epf"
            value={formData.epf}
            onChange={handleChange}
            list="epf-options"
            className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
            required
          />
          <datalist id="epf-options">
            {members?.map((member) => (
              <option key={member._id} value={member.epf} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium mb-1">
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
          ></textarea>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-900 text-white font-semibold rounded-md hover:bg-red-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RefundForm;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "@/constants";
// import toast from "react-hot-toast";

// const RefundForm = () => {
//   const [members, setMembers] = useState([]);
//   const [formData, setFormData] = useState({
//     epf: "",
//     amount: "",
//     reason: "",
//     message: "",
//   });

//   const fetchMembers = async () => {
//     try {
//       const memberFetch = await axios.get(`${BASE_URL}/api/members`, {
//         withCredentials: true,
//       });

//       setMembers(memberFetch.data);
//     } catch (error) {
//       console.error("Error fetching members:", error);
//     }
//   };
//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`${BASE_URL}/api/refunds`, formData, {
//         withCredentials: true,
//       });
//       toast.success("Form submitted successfully");
//       setFormData({
//         epf: "",
//         amount: "",
//         reason: "",
//         message: "",
//       });
//     } catch (error) {
//       toast.error("There was an error submitting the form.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="epf" className="block text-sm font-medium mb-1">
//             EPF Number
//           </label>
//           {/* <input
//             type="text"
//             id="epf"
//             name="epf"
//             value={formData.epf}
//             onChange={handleChange}
//             className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
//             required
//           /> */}
//           <select
//             id="epf"
//             name="epf"
//             value={formData.epf}
//             onChange={handleChange}
//             required
//             className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500"
//           >
//             {members?.map((member) => (
//               <option key={member._id}>{member.epf}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="amount" className="block text-sm font-medium mb-1">
//             Amount
//           </label>
//           <input
//             type="number"
//             id="amount"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="reason" className="block text-sm font-medium mb-1">
//             Reason
//           </label>
//           <textarea
//             id="reason"
//             name="reason"
//             value={formData.reason}
//             onChange={handleChange}
//             className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
//           ></textarea>
//         </div>

//         <div>
//           <label htmlFor="message" className="block text-sm font-medium mb-1">
//             Message
//           </label>
//           <textarea
//             id="message"
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-2 leading-tight focus:outline-none focus:border-red-500"
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-red-900 text-white font-semibold rounded-md hover:bg-red-800"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RefundForm;
