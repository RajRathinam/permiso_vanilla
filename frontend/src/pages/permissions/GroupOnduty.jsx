import React, { useRef, useState, useEffect } from 'react'
import QRCode from 'react-qr-code';
import { FaSearch } from "react-icons/fa";
import { MdOutlineGroupAdd } from "react-icons/md";
import SearchTable from "../../components/common/SearchTable";
import baseUrl from '../../config/config';

const Onduty = ({ authUser }) => {
  const [fileName, setFileName] = useState("choose file");
  const [isSearch, setIsSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [fromBackend, setFromBackend] = useState([]);
  const date = new Date();
  const [formValues, setFormValues] = useState({
    reason: '',
    event: '',
    venue: '',
    participants: '',
    proof: null,
    remarks: '',
    fromDate: '',
    toDate: '',
    fromTime: '',
    toTime: '',
    participantsId: []
  });

  const componentRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormValues(prev => ({ ...prev, proof: file }));
    } else {
      setFileName("choose file");
    }
  };

  const handleSubmit = async () => {
    const participantIds = data.map(p => p._id);
    const submissionData = {
      ...formValues,
      participantsId: participantIds,
    };
console.log(submissionData);

    // try {
    //   const res = await fetch('http://localhost:5000/api/onduty/submit', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(submissionData)
    //   });

    //   if (!res.ok) throw new Error('Failed to submit form');

    //   const result = await res.json();
    //   alert('On-Duty request submitted successfully!');
    // } catch (error) {
    //   console.error(error);
    //   alert('Submission failed.');
    // }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/all`);
        const datas = await res.json();
        setFromBackend(datas);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const filteredResults = fromBackend.filter((student) =>
    student.registerNumber.includes(searchTerm)
  );

  const handlePrint = () => {
    const printContent = componentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };
  const left = data.length >= 1 ? data.slice(0, 10) : 0;
  const right = data.length >= 10 ? data.slice(10) : 0;
  return (<section className='flex gap-10 justify-between p-5 w-full'>
    <div className='lg:flex lg:flex-col justify-start items-center w-[60%] mb-10'>
      <div ref={componentRef} className="w-full lg:w-[210mm] h-auto text-black lg:mt-6 bg-white p-5 sm:p-10 shadow-lg border border-red-950">
        <h1 className="lg:text-2xl text-sm font-bold mb-2 text-center underline">E.G.S.PILLAY ENGINEERING COLLEGE</h1>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center underline">TEAM OD REQUISITION FORM</h1>
        <div className="flex flex-col sm:flex-row justify-between border-b-2 py-1">
          <h2 className="px-1 text-sm"><b>Academic year</b> : {date.getFullYear()}-{date.getFullYear() + 1}</h2>
          <h2 className="px-1"><b>Date</b> : {date.toLocaleDateString()}</h2>
        </div>
        <div className="flex flex-col sm:flex-row border-b-2">
          <h2 className="w-full sm:w-[60%] border-l-2 border-r-2 p-1 flex"><b className="pr-1">Reason</b> :
            <select className="pl-1 w-full bg-white outline-none" name='reason' value={formValues.reason} onChange={handleInputChange}>
              <option value="">Select...</option>
              <option value="Academics">Academics</option>
              <option value="Extracurriculars">Extracurriculars</option>
              <option value="Technical">Technical</option>
              <option value="Sports">Sports</option>
            </select>
          </h2>
          <h2 className="w-full flex sm:flex-1 border-r-2 p-1"><b>Date&nbsp;</b> : <input name="fromDate" type="date" value={formValues.fromDate} onChange={handleInputChange} className='bg-white text-center' /></h2>
        </div>
        <div className="flex flex-col sm:flex-row border-b-2">
          <h2 className="w-full sm:w-[60%] border-l-2 border-r-2 p-1"><b>Event</b> : <input name='event' value={formValues.event} onChange={handleInputChange} type='text' maxLength={35} placeholder=' enter event name shortly' className='w-[330px] focus:outline-none focus:ring-0 bg-white' /></h2>
          <h2 className="w-full sm:flex-1 border-r-2 p-1"><b>Venue</b> :  <input name='venue' value={formValues.venue} onChange={handleInputChange} type='text' maxLength={35} placeholder=' enter venue name' className='flex-1 w-[200px] focus:outline-none focus:ring-0 bg-white' /></h2>
        </div>
        <div className="flex flex-col sm:flex-row border-b-2 mb-2">
          <h2 className="w-[60%] border-l-2 border-r-2 p-1">
            <b>Number Of Participants</b> :
            <input
            name='participants'
              type="number"
              placeholder="number of Members"
              className="w-auto text-center focus:outline-none focus:ring-0 bg-white"
               value={formValues.participants} onChange={handleInputChange}
            />
          </h2>
          <h2 className="w-full sm:flex-1 border-r-2 p-1 flex items-center gap-2">
            <b>Proof</b> :
            <label className="text-gray-400 py-1 rounded cursor-pointer hover:underline">
              {fileName}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row border-y-2 mb-3">
          <div className="w-full sm:w-[13%] border-l-2 border-r-2 p-1 flex justify-center items-center"><h2><b>On-Duty </b>:</h2></div>
          <div className="flex-1 sm:border-r-2">
            <div className="flex flex-col sm:flex-row border-b-2">
              <div className="w-full sm:w-1/2 flex">
                <div className="w-full sm:w-1/2 text-center border-r-2"><h2><b>From</b></h2></div>
                <div className="w-full sm:w-1/2 text-center border-r-2"><h2><b>To</b></h2></div>
              </div>
              <div className="w-full sm:w-1/2 text-center"><h2><b>Time</b></h2></div>
            </div>
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/2 flex">
                <div className="w-full sm:w-1/2 text-center border-r-2"><h2><input type='date' name='fromDate'  value={formValues.fromDate} onChange={handleInputChange} className=' bg-white text-center w-full' /></h2></div>
                <div className="w-full sm:w-1/2 text-center border-r-2"><h2><input name='toDate'  value={formValues.toDate} onChange={handleInputChange} type='date' className=' bg-white text-center w-full' /></h2></div>
              </div>
              <div className="w-full sm:w-1/2 flex">
                <div className="w-full sm:w-1/2 text-center border-r-2"><h2><input name='fromTime'  value={formValues.fromTime} onChange={handleInputChange} type='time' className='bg-white text-center w-full' /></h2></div>
                <div className="w-full sm:w-1/2 text-center"><h2><input type='time' name='toTime'  value={formValues.toTime} onChange={handleInputChange} className='bg-white text-center w-full' /></h2></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-2">
          <textarea
          name='remarks'
            className="w-full bg-white p-1 border border-gray-300 resize-none"
            rows="3"
            placeholder="Enter your remarks here..."
             value={formValues.remarks} onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col sm:flex-row space-x-4 mb-2">
          {data.length !== 0 ?
            <>  <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300">S.no</th>
                    <th className="border border-gray-300">Name</th>
                    <th className="border border-gray-300">Year/Dept</th>
                  </tr>
                </thead>
                <tbody>
                  {left && left.map((person) => (
                    <tr key={person.id}>
                      <td className="border border-gray-300 text-center">{person.id}</td>
                      <td className="border border-gray-300 p-1 text-center">{person.fullName}</td>
                      <td className="border border-gray-300 p-1 text-center">{person.classSection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

              <div className="w-full sm:w-1/2">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300">S.no</th>
                      <th className="border border-gray-300">Name</th>
                      <th className="border border-gray-300">Year/Dept</th>
                    </tr>
                  </thead>
                  <tbody>
                    {right.length > 0 && right.map((person) => (
                      <tr key={person.id}>
                        <td className="border border-gray-300 text-center">{person.id}</td>
                        <td className="border border-gray-300 p-1 text-center">{person.fullName}</td>
                        <td className="border border-gray-300 p-1 text-center">{person.classSection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div></> : <MdOutlineGroupAdd onClick={() => setIsSearch(prev => !prev)} className='w-52 h-52 text-slate-300 hover:text-slate-700 mx-auto cursor-pointer' />}
        </div>
        <div className="flex flex-col sm:flex-row justify-between border-2 p-5 mb-2">
          <div className="w-full sm:w-2/3 flex flex-wrap justify-evenly">
            <div className="w-full sm:w-1/2 text-center flex flex-col"><span className="text-green-500">Accepted</span><b>Physical Director</b></div>
            <div className="w-full sm:w-1/2 text-center flex flex-col"><span className="text-green-500">Accepted</span><b>Principal</b></div>
            <div className="w-full sm:w-1/2 text-center flex flex-col"><span className="text-red-500">Rejected</span><b>Administration Head</b></div>
            <div className="w-full sm:w-1/2 text-center flex flex-col"><span className="text-red-500">Rejected</span><b>Joint Secretary</b></div>
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0">
            <QRCode
              value="https://mern-chatsapp.onrender.com/"
              size={150}
              fgColor="black"
              bgColor="white"
              level="H"
            />
          </div>
        </div>
        <div className="text-center border-2 p-3">
          On-Duty for the Above Students
        </div>
      </div>
      <button onClick={handleSubmit} className="btn btn-primary mx-auto my-5">Download PDF</button>
    </div>

    <div className='flex flex-col gap-3 p-5 items-center justify-start w-[40%] my-auto pt-6 fixed right-0 top-24'>
      <label className="input bg-white w-full flex justify-center items-center gap-4">
        <FaSearch className='w-6 h-6' />
        <input
          type="search"
          className="grow"
          placeholder="Search with Register Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      {isSearch && <SearchTable fromBackend={filteredResults} setData={setData} currentData={data} />}
      {!isSearch &&
        <div className='mt-12'><MdOutlineGroupAdd onClick={() => setIsSearch(prev => !prev)} className='w-52 h-52 text-slate-300 hover:text-slate-700 mx-auto cursor-pointer' /><h1>Click On The Logo To Access The User's List</h1></div>}
    </div>
    
  </section>
  )
}

export default Onduty
