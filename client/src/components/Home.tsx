import { useEffect, useState } from "react";
import service from "../services/requestbin_service";
import { Link, useNavigate } from "react-router-dom";

const Home = ({ binList, setBinList }) => {
  const [newUrl, setNewUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    service.getAllBins().then((data) => setBinList(data.flat()));
    service.generateBin().then((data) => setNewUrl(data));
  }, []);

  const handleFormSubmission = async (formData) => {
    try {
      const newUrl = formData.get("new_url");
      const newBin = await service.createBin(newUrl);
      const updatedList = binList.slice();

      updatedList.push(newBin);
      setBinList(updatedList);

      alert(`${newBin} bin has been created!`);
      navigate(`/bin/${newBin}`);
    } catch (err) {
      if (err) {
        alert(err.message);
      }
    }
  };

  const redirectHome = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <>
      <header>
        <h2 onClick={redirectHome}>
          RequestBin<em>Capstone</em>
        </h2>
      </header>

      <main>
        <div id="home-flex" className="home-flex">
          <NewBinForm
            onFormSubmission={handleFormSubmission}
            newUrl={newUrl}
            setNewUrl={setNewUrl}
          />
          <Bins binList={binList} />
        </div>
      </main>
    </>
  );
};

const NewBinForm = ({ onFormSubmission, newUrl, setNewUrl }) => {
  const handleFormUrlChange = (e) => {
    setNewUrl(e.target.value);
  };

  return (
    <div id="new_bin_form" className="new_bin_form">
      <form id="new_bin_form" action={onFormSubmission}>
        <h1>New Basket</h1>
        <p>Click the button below to create a new basket!</p>
        <label htmlFor="new_url">http://3.84.206.208/</label>
        <input
          id="new_url"
          name="new_url"
          className="new_url"
          value={newUrl}
          onChange={handleFormUrlChange}
          required
        ></input>
        <button>Create!</button>
      </form>
    </div>
  );
};

const Bins = ({ binList }) => {
  return (
    <div id="bin_list" className="bin_list">
      <div id="bin_list_label">
        <h3>Available Bins:</h3>
      </div>
      <div id="bin_list_items" className="bin_list_items">
        <ul>
          {binList.map((binUrl, idx) => {
            return (
              <li key={idx}>
                <Link to={`/bin/${binUrl}`} className="bin_list_link">
                  {binUrl}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
