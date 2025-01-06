import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function CustomerCard({ customer }) {
  return (
    <div className="bg-white rounded-lg  transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            customer.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {customer.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <EnvelopeIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">{customer.email}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <PhoneIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">{customer.phone}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">Joined: {customer.joinDate}</span>
        </div>
      </div>
    </div>
  );
}
