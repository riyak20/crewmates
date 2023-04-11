import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = 'https://dhcyfmhgnkhzphvrgcpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY3lmbWhnbmtoenBodnJnY3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExNzI3NTcsImV4cCI6MTk5Njc0ODc1N30.l_go3SsL8u0L51B4n4JbwI_u2UBLkGPhUdeLOgLhE2M';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [characters, setCrewmates] = useState([]);
  const [newCrewmateName, setNewCrewmateName] = useState('');
  const [newCrewmateSpeed, setNewCrewmateSpeed] = useState('');
  const [newCrewmateColor, setNewCrewmateColor] = useState('red');
  const [showGallery, setShowGallery] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSpeed, setEditSpeed] = useState('');
  const [editColor, setEditColor] = useState('');

  useEffect(() => {
    fetchCrewmates();
  }, []);

  async function fetchCrewmates() {
    const { data: characters, error } = await supabase
      .from('unit7proj')
      .select('*');

    if (error) {
      console.log(error);
      return;
    }

    setCrewmates(characters);
  }

  async function createCrewmate() {
    const { data: character, error } = await supabase
      .from('unit7proj')
      .insert({ name: newCrewmateName, speed: newCrewmateSpeed, color: newCrewmateColor });

    if (error) {
      console.log(error);
      return;
    }

    setNewCrewmateName('');
    setNewCrewmateSpeed('');
    setNewCrewmateColor('red');

    fetchCrewmates();
  }


  async function deleteCrewmate(id) {
    await supabase.from('unit7proj').delete().eq('id', id);
    fetchCrewmates();
  }

  async function updateCrewmate(id, name, speed, color) {
    const { data: character, error } = await supabase
      .from('unit7proj')
      .update({ name, speed, color })
      .eq('id', id);

    if (error) {
      console.log(error);
      return;
    }

    fetchCrewmates();
    setEditId(null);
    setEditName('');
    setEditSpeed('');
    setEditColor('');
  }


  function handleSubmit(event) {
    event.preventDefault();
    createCrewmate();
  }

  function toggleGallery() {
    setShowGallery(!showGallery);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crewmate List</h1>
        <button onClick={toggleGallery}>
          {showGallery ? 'Hide gallery' : 'Show gallery'}
        </button>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={newCrewmateName}
            onChange={(event) => setNewCrewmateName(event.target.value)}
          />
          <input
            type="text"
            placeholder="Speed (mph)"
            value={newCrewmateSpeed}
            onChange={(event) => setNewCrewmateSpeed(event.target.value)}
          />
          <select
            value={newCrewmateColor}
            onChange={(event) => setNewCrewmateColor(event.target.value)}
          >
            <option value="">Select color</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </select>
          <button type="submit">Create character</button>
        </form>
        {showGallery && (
          <ul>
            {characters.map((character) => (
              <li key={character.id}>
                <input
                  type="text"
                  value={editId === character.id ? editName : character.name}
                  onChange={(event) => {
                    if (editId === character.id) {
                      setEditName(event.target.value);
                    }
                  }}
                />
                <input
                  type="text"
                  value={editId === character.id ? editSpeed : character.speed}
                  onChange={(event) => {
                    if (editId === character.id) {
                      setEditSpeed(event.target.value);
                    }
                  }}
                />
                <select
                  value={editId === character.id ? editColor : character.color || ''}
                  onChange={(event) => {
                    if (editId === character.id) {
                      setEditColor(event.target.value);
                    }
                  }}
                >
                  <option value="">Select color</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </select>
                {editId === character.id ? (
                  <button onClick={() => updateCrewmate(character.id, editName, editSpeed, editColor)}>Save</button>
                ) : (
                  <button onClick={() => {
                    setEditId(character.id);
                    setEditName(character.name);
                    setEditSpeed(character.speed);
                    setEditColor(character.color);
                  }}>Edit</button>
                )}
                <button onClick={() => deleteCrewmate(character.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );



}

export default App;
