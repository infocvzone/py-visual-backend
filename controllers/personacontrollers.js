const Persona = require("../models/persona");

exports.createPersona = async (req, res) => {
    const { persona } = req.body;
    try {
        if (!persona) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        await Persona.deleteMany({});
        const savedPerson = new Persona({ persona });
        await savedPerson.save();

        res.status(200).json(savedPerson);

    } catch (error) {
        console.error('Persona error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

exports.getAllPersonas = async (req, res) => {
    try {
        const personas = await Persona.find({});
        if (personas.length === 0) {
            return res.status(404).json({ message: 'No personas found.' });
        }
        res.status(200).json(personas);
    } catch (error) {
        console.error('Error fetching personas:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};