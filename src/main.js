// Import Buffer explicitly
import { Buffer } from 'buffer';

// Other imports
import { HttpAgent, Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

const idlFactory = ({ IDL }) => {
    return IDL.Service({
        'classify': IDL.Func([IDL.Vec(IDL.Float32)], [IDL.Variant({ Ok: IDL.Vec(IDL.Record({ label: IDL.Text, score: IDL.Float32 })) })], []),
    });
};

let rarityData = [];

// Fetch the rarity data
fetch('all_rarity_scores.json')
    .then(response => response.json())
    .then(data => {
        rarityData = data;
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });

const getRarityScore = (tokenID, collection) => {
    const record = rarityData.find(item => item['Token ID'] == tokenID && item.collection === collection);
    return record ? record['Rarity Score'] : null;
};

const mapOptionToBinaryFields = (selectedOption) => {
    const options = [
        'rw623-hyaaa-aaaah-qctcq-cai',
        'ugdkf-taaaa-aaaak-acoia-cai',
        '4ggk4-mqaaa-aaaae-qad6q-cai',
        'skjpp-haaaa-aaaae-qac7q-cai',
        'pk6rk-6aaaa-aaaae-qaazq-cai',
        'dhiaa-ryaaa-aaaae-qabva-cai',
        'bxdf4-baaaa-aaaah-qaruq-cai',
        '3mttv-dqaaa-aaaah-qcn6q-cai',
        'oeee4-qaaaa-aaaak-qaaeq-cai'
    ];
    const binaryFields = new Array(9).fill(0.0);
    const index = options.indexOf(selectedOption);
    if (index !== -1) {
        binaryFields[index] = 1.0;
    }
    return binaryFields;
};

document.getElementById('callCanister').addEventListener('click', async () => {
    const tokenID = parseInt(document.getElementById('tokenID').value);
    const selectedOption = document.getElementById('optionSelect').value;

    const rarityScore = getRarityScore(tokenID, selectedOption);
    if (rarityScore === null) {
        document.getElementById('prediction').innerText = `Error: Token ID or collection not found`;
        return;
    }

    const floorPrice = 0.0; // Assuming floor price is not used, or set it to a default value
    const binaryFields = mapOptionToBinaryFields(selectedOption);

    const inputArray = [rarityScore, floorPrice, ...binaryFields];

    const agent = new HttpAgent({ host: 'https://ic0.app' });

    const canisterId = Principal.fromText('vb5wr-jaaaa-aaaak-akvrq-cai');

    const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId,
    });

    try {
        console.log(inputArray);
        const result = await actor.classify(inputArray);
        const prediction = result.Ok.map(record => `${record.score.toFixed(2)}`).join(', ');
        document.getElementById('prediction').innerText = `Prediction: ${prediction}`;
    } catch (error) {
        document.getElementById('prediction').innerText = `Error calling canister: ${error}`;
    }
});
