import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/api/authContext";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api/axiosInstance";
import { BASE_URL } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { SquarePen, Trash2 } from "lucide-react";
import MemberUpdate from "./MemberUpdate";
import { isSecretaryOrAssistantSecretary, isSuperAdmin } from "@/authorization";

const MembersTable = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedMemberId, setHighlightedMemberId] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();
  const memberRefs = useRef({});
  const { user } = useAuth();
  const scrollPositionRef = useRef(0); // Ref to store scroll position

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await API.get("/members", {
        withCredentials: true,
      });
      const sortedMembers = response.data.sort(
        (a, b) => a.welfareNo - b.welfareNo
      );
      setMembers(sortedMembers);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDialogOpen = (member) => {
    setSelectedMember(member);
  };

  const handleDialogClose = () => {
    setSelectedMember(null);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await axios.delete(`${BASE_URL}/api/members/${memberId}`, {
          withCredentials: true,
        });
        setMembers(members.filter((member) => member._id !== memberId));
        alert("Member deleted successfully.");
      } catch (error) {
        console.error("Error deleting member:", error);
        alert("Failed to delete member!!!");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.epf?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.welfareNo
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.name?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (
      filteredMembers.length > 0 &&
      memberRefs.current[filteredMembers[0]._id]
    ) {
      setHighlightedMemberId(filteredMembers[0]._id);
      memberRefs.current[filteredMembers[0]._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      setHighlightedMemberId(null);
    }
  }, [filteredMembers]);

  const handleMemberClick = (epf) => {
    // Save scroll position in ref
    scrollPositionRef.current = window.scrollY;
    navigate(`/dashboard/members/${epf}`, {
      state: { scrollPosition: scrollPositionRef.current },
    });
  };

  // Restore scroll position when component mounts
  useEffect(() => {
    if (scrollPositionRef.current) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, []);

  return (
    <div className="p-8 my-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="text-gray-700 font-semibold">
            Search:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Search by EPF or Welfare No..."
          />
        </div>
        {isSecretaryOrAssistantSecretary(user) && (
          <button
            className="bg-red-900 hover:bg-red-700 text-yellow-200 text-xl font-semibold rounded-lg px-8 py-2 transition duration-300"
            onClick={() => navigate("/dashboard/members/register")}
          >
            Register New Member
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-red-900 text-white text-xs md:text-sm">
            <tr>
              {[
                "EPF no",
                "Welfare no",
                "Name",
                "Date of Registered",
                "Date of Joined",
                "Payroll",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, index) => (
              <tr
                key={member._id}
                ref={(el) => (memberRefs.current[member._id] = el)}
                className={`${
                  highlightedMemberId === member._id
                    ? "bg-yellow-200"
                    : index % 2 === 0
                    ? "bg-yellow-50"
                    : "bg-red-50"
                }`}>
                <td className="border px-4 py-2 text-sm whitespace-nowrap">
                  {member.epf}
                </td>
                <td className="border px-4 py-2 text-sm whitespace-nowrap">
                  {member.welfareNo}
                </td>
                <td className="border px-4 py-2 text-sm whitespace-nowrap">
                  {member.name}
                </td>
                <td className="border px-4 py-2 text-sm whitespace-nowrap">
                  {formatDate(member.dateOfRegistered)}
                </td>
                <td className="border px-4 py-2 text-sm whitespace-nowrap">
                  {formatDate(member.dateOfJoined)}
                </td>
                <td className="border px-4 py-2 text-sm whitespace-nowrap">
                  {member.payroll}
                </td>
                <td className="border px-4 py-2 text-sm whitespace-nowrap flex space-x-2">
                  {isSecretaryOrAssistantSecretary(user) && (
                    <Dialog>
                      <DialogTrigger>
                        <div className="bg-green-500 hover:bg-green-700 text-white rounded-lg p-1">
                          <SquarePen className="p-0.5" />
                        </div>
                      </DialogTrigger>
                      <DialogContent
                        onClose={handleDialogClose}
                        className="max-w-lg mx-auto max-h-[600px] overflow-y-scroll border-none shadow-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                        <DialogHeader className="border-b pb-4">
                          <DialogTitle className="text-2xl font-bold">
                            {member.name}
                          </DialogTitle>
                          <DialogDescription>
                            Update Member Details.
                          </DialogDescription>
                        </DialogHeader>
                        <MemberUpdate memberId={member} />
                      </DialogContent>
                    </Dialog>
                  )}
                  {isSuperAdmin(user) && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white rounded-lg p-1"
                      onClick={() => handleDelete(member._id)}>
                      <Trash2 className="p-0.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleMemberClick(member.epf)}
                    className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-3 py-1">
                    View Profile
                  </button>
                  <Dialog>
                    {/* <DialogTrigger>
                      <div
                        onClick={() => handleDialogOpen(member)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white rounded-lg px-3 py-1">
                        View Details
                      </div>
                    </DialogTrigger> */}
                    {selectedMember && (
                      <DialogContent
                        onClose={handleDialogClose}
                        className="max-w-lg mx-auto max-h-[600px] overflow-y-scroll border-none shadow-none scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                        <DialogHeader className="border-b pb-4">
                          <DialogTitle className="text-2xl font-bold">
                            {selectedMember.name}
                          </DialogTitle>
                          <DialogDescription>
                            Here are the full details of the member.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-2 text-gray-700 space-y-2">
                          <p>
                            <strong>Email:</strong>{" "}
                            {selectedMember.email || "N/A"}
                          </p>
                          <p>
                            <strong>EPF No:</strong> {selectedMember.epf}
                          </p>
                          <p>
                            <strong>Date of Birth:</strong>{" "}
                            {selectedMember.dateOfBirth || "N/A"}
                          </p>
                          <p>
                            <strong>Date of Joined:</strong>{" "}
                            {selectedMember.dateOfJoined || "N/A"}
                          </p>
                          <p>
                            <strong>Date of Registered:</strong>{" "}
                            {selectedMember.dateOfRegistered || "N/A"}
                          </p>
                          <p>
                            <strong>Welfare No:</strong>{" "}
                            {selectedMember.welfareNo}
                          </p>
                          <p>
                            <strong>Role:</strong> {selectedMember.role}
                          </p>
                          <p>
                            <strong>Payroll:</strong> {selectedMember.payroll}
                          </p>
                          <p>
                            <strong>Division:</strong> {selectedMember.division}
                          </p>
                          <p>
                            <strong>Branch:</strong> {selectedMember.branch}
                          </p>
                          <p>
                            <strong>Unit:</strong> {selectedMember.unit}
                          </p>
                          <p>
                            <strong>Contact Number:</strong>{" "}
                            {selectedMember.contactNo?.number || "N/A"}
                          </p>
                          <p>
                            <strong>WhatsApp Number:</strong>{" "}
                            {selectedMember.contactNo?.whatsappNo || "N/A"}
                          </p>
                          <p>
                            <strong>Spouse Name:</strong>{" "}
                            {selectedMember.spouseName || "N/A"}
                          </p>
                          <p>
                            <strong>Mother's Name:</strong>{" "}
                            {selectedMember.motherName || "N/A"}
                          </p>
                          <p>
                            <strong>Father's Name:</strong>{" "}
                            {selectedMember.fatherName || "N/A"}
                          </p>
                          <p>
                            <strong>Mother-in-Law's Name:</strong>{" "}
                            {selectedMember.motherInLawName || "N/A"}
                          </p>
                          <p>
                            <strong>Father-in-Law's Name:</strong>{" "}
                            {selectedMember.fatherInLawName || "N/A"}
                          </p>
                          <p>
                            <strong>Member Fee:</strong>{" "}
                            {selectedMember.memberFee
                              ? `$${selectedMember.memberFee}`
                              : "N/A"}
                          </p>
                          {selectedMember.children?.length > 0 && (
                            <div>
                              <strong>Children:</strong>
                              <ul className="list-disc list-inside">
                                {selectedMember.children.map((child, i) => (
                                  <li key={i}>
                                    {child.name}, Age: {child.age}, Gender:{" "}
                                    {child.gender}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;