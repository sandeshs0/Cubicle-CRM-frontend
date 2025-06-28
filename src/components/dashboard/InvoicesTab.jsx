import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

const InvoicesTab = ({ invoices = [] }) => {
  const [sortBy] = useState("amount");

  // Example invoices for the UI screenshot
  const exampleInvoices = [
    {
      id: "2025-03-23-CB101",
      date: "3 Months ago",
      status: "Cleared",
      amount: 50000,
      receivedAmount: 50000
    },
    {
      id: "2025-04-23-CB102",
      date: "3 Months ago",
      status: "Pending",
      amount: 40000,
      receivedAmount: 0
    },
    {
      id: "2025-05-23-CB103",
      date: "3 Months ago",
      status: "Partially Cleared",
      amount: 20000,
      receivedAmount: 10000
    }
  ];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch(status.toLowerCase()) {
        case 'cleared': return "bg-green-100 text-green-800";
        case 'pending': return "bg-orange-100 text-orange-800";
        case 'partially cleared': return "bg-yellow-100 text-yellow-800";
        default: return "bg-gray-100 text-gray-800";
      }
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusStyle()}`}>
        {status}
      </span>
    );
  };

  // Use the actual invoices if available, otherwise use examples for display
  const displayInvoices = invoices.length > 0 ? invoices : exampleInvoices;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {displayInvoices.length > 0 && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Sort By:</span>
            <div className="relative">
              <button className="border rounded px-3 py-1 flex items-center">
                <span>{sortBy === "amount" ? "Amount" : "Date"}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}
        
        <button className="bg-[#007991] text-white px-3 py-2 rounded-md shadow flex items-center">
          <Plus size={16} className="mr-1" />
          New Invoice
        </button>
      </div>

      {displayInvoices.length === 0 ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center">
          <div className="text-center">
            <img
              src="/img/empty-invoice.png"
              alt="No invoices"
              className="w-24 h-24 mx-auto mb-4 opacity-60"
              onError={(e) => {
                e.target.outerHTML = `<div class="w-24 h-24 mx-auto mb-4 flex items-center justify-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M7 15h0M7 11h0M7 7h0M15 15h2M15 11h2M15 7h2" />
                  </svg>
                </div>`;
              }}
            />
            <h3 className="text-lg text-gray-600 font-medium">No invoices yet</h3>
            <p className="text-gray-500 mt-1">Create your first invoice to get paid</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayInvoices.map((invoice) => (
            <div 
              key={invoice.id}
              className="bg-white rounded-md border border-gray-200 flex flex-wrap md:flex-nowrap justify-between items-center p-4"
            >
              <div>
                <h4 className="font-medium">Invoice #{invoice.id}</h4>
                <p className="text-sm text-gray-500">{invoice.date}</p>
                <StatusBadge status={invoice.status} />
              </div>
              
              <div className="mt-3 md:mt-0 w-full md:w-auto text-right">
                <div className="font-medium">Ask: Rs. {invoice.amount.toLocaleString()}</div>
                <div className={invoice.receivedAmount > 0 ? "text-green-600" : "text-gray-500"}>
                  Received: Rs. {invoice.receivedAmount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoicesTab;