import React from 'react';
import { Link } from 'react-router-dom';

const AppliedRequest = ({ i }) => {
  return (
    <div className="p-4 rounded-lg shadow-md mt-6">
      <div className="flex justify-between">
        <span><b>{i.requesttype}</b> <span className='text-sm'>{new Date(i.createdAt).toLocaleDateString('en-GB')}</span></span>
        {i.staffs.approved === null || i.staffs.approved === undefined
          ? <span className="text-blue-500">Pending</span>
          : i.staffs.approved === true
            ?<Link to={i.requesttype === 'On-duty Request' ? `/single-request`:`/leave-request`}
            state={{i}} > <span className="text-green-600">Approved</span></Link>
            :<Link to={i.requesttype === 'On-duty Request' ? `/single-request`:`/leave-request`} state={{i}} ><span className="text-red-600">Rejected</span></Link>
        }
      </div>
    </div>
  )
}

export default AppliedRequest
