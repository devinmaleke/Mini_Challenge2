const express = require('express')
const cors = require('cors')
const Op = require('sequelize').Op

const app = express()
const PORT = 3000

const {bahan} = require('./models')
const {resep} = require('./models')
const {resep_alatmasak} = require('./models')
const {alatmasak} = require('./models')
const {resep_personalisasi} = require('./models')
const {personalisasi} = require('./models')
const {tagbahan} = require('./models')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/resep', async (req, res) => {
    const alatMasak = req.query.alatMasak
    const waktuPembuatan = req.query.waktuPembuatan
    const bahanKurang = req.query.bahanKurang
    let personalisasiOrang
    if (req.query.personalisasiOrang) {
        personalisasiOrang = req.query.personalisasiOrang.split(',')
    }
    let resepId
    if (req.query.resepId) {
        arr = req.query.resepId.split(',')

        resepId = arr.map((el) => {
            return {id: Number(el)}
        })
    }
    let resepDetailId
    if (req.query.resepDetailId) {
        arr = req.query.resepDetailId.split(',')

        resepDetailId = arr.map((el) => {
            return {id: Number(el)}
        })
    }
    let resepByBahan
    if (req.query.resepByBahan) {
        arr = req.query.resepByBahan.split(',')

        resepByBahan = arr.map((el) => {
            return {tagbahan_id: Number(el)}
        })
    }

    const onlyAlatMasak = () => {
        if (alatMasak === 'left') {
            return {
                [Op.between]: [0, 1]
            }
        } else if (alatMasak == 'middle') {
            return {
                [Op.between]:[3, 5]
            }
        } else if (alatMasak == 'right') {
            return { 
                [Op.between]: [6, 100]
            }
        }else if (alatMasak == 'left,middle' || alatMasak == 'middle,left') {
            return {
                [Op.between]: [0,5]
            }
        }else if (alatMasak == 'left,right' || alatMasak == 'right,left') {
            return {
            [Op.or]: [
                { [Op.between]: [0, 1] },
                { [Op.between]: [6, 100] }
            ]}
        }else if (alatMasak == 'middle,right' || alatMasak == 'right,middle') {
            return {
                [Op.between]:[3, 100]
            }
        }
        else 
        {
            return
        }
    }

    const onlyWaktuPembuatan = () => {
        if (waktuPembuatan === 'left') {
            return {
                [Op.between]: [0, 9]
            }
        } else if (waktuPembuatan == 'middle') {
            return {
                [Op.between]:[10, 20]
            }
        } else if (waktuPembuatan == 'right') {
            return { 
                [Op.between]: [20, 1000000]
            }
        }else if (waktuPembuatan == 'left,middle' || waktuPembuatan == 'middle,left') {
            return {
                [Op.between]: [0, 20]
            }
        }else if (waktuPembuatan == 'left,right' || waktuPembuatan == 'right,left') {
            return {
            [Op.or]: [
                { [Op.between]: [0, 9] },
                { [Op.between]: [20, 1000000] }
            ]}
        }else if (waktuPembuatan == 'middle,right' || waktuPembuatan == 'right,middle') {
            return {
                [Op.between]:[10, 1000000]
            }
        }
        else 
        {
            return
        }
    }
    const onlyBahanKurang = () => {
        if (bahanKurang === 'left') {
            return {
                [Op.between]: [0, 1]
            }
        } else if (bahanKurang == 'middle') {
            return {
                [Op.between]:[2, 5]
            }
        } else if (bahanKurang == 'right') {
            return { 
                [Op.between]: [6, 1000]
            }
        }else if (bahanKurang == 'left,middle') {
            return {
                [Op.between]: [0, 5]
            }
        }else if (bahanKurang == 'left,right') {
            return {
            [Op.or]: [
                { [Op.between]: [0, 1] },
                { [Op.between]: [6, 1000] }
            ]}
        }else if (bahanKurang == 'middle,right') {
            return {
                [Op.between]:[2, 1000]
            }
        }
        else 
        {
            return
        }
    }

    
    try {
        if (resepId && alatMasak && waktuPembuatan && bahanKurang && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (resepId && alatMasak && waktuPembuatan && bahanKurang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

       else if (resepId && alatMasak && waktuPembuatan && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (resepId && waktuPembuatan && bahanKurang && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }



        else if (alatMasak && waktuPembuatan && bahanKurang && personalisasiOrang){
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),
                     
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (resepId && alatMasak && waktuPembuatan) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (resepId && alatMasak && bahanKurang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    jml_alat: onlyAlatMasak(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && alatMasak && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    jml_alat: onlyAlatMasak(), 
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && waktuPembuatan && bahanKurang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && waktuPembuatan && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && bahanKurang && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (alatMasak && waktuPembuatan && bahanKurang) {
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),
                     
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        
        else if (alatMasak && waktuPembuatan && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),
                     
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        
       else if (alatMasak && bahanKurang && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (waktuPembuatan && bahanKurang && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    estimasi: onlyWaktuPembuatan(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && alatMasak) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    jml_alat: onlyAlatMasak(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && waktuPembuatan) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                    estimasi: onlyWaktuPembuatan(),  
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && bahanKurang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId,
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepId, 
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (alatMasak && waktuPembuatan) {
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak(),
                    estimasi: onlyWaktuPembuatan(),
                     
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (alatMasak && bahanKurang) {
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (alatMasak && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (waktuPembuatan && bahanKurang) {
            const data = await resep.findAll({
                where: {
                    estimasi: onlyWaktuPembuatan(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (waktuPembuatan && personalisasiOrang) {
            const data = await resep.findAll({
                where: {
                    estimasi: onlyWaktuPembuatan(),
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        if (bahanKurang && personalisasiOrang) {
            const data = await resep.findAll({
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }

        else if (alatMasak) {
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyAlatMasak()
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ]
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        } 
        else if (waktuPembuatan){
            const data = await resep.findAll({
                where: {
                    estimasi: onlyWaktuPembuatan()
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ]
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON); 
        }
        else if(bahanKurang){
            const data = await resep.findAll({
                where: {
                    jml_alat: onlyBahanKurang()
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ]
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if(personalisasiOrang){
            const data = await resep.findAll({
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                        where: {
                            [Op.or]: [{personalisasi_id: personalisasiOrang[0]}, 
                            {personalisasi_id: personalisasiOrang[1] ? personalisasiOrang[1] : null}, 
                            {personalisasi_id: personalisasiOrang[2] ? personalisasiOrang[2] : null}, 
                            {personalisasi_id: personalisasiOrang[3] ? personalisasiOrang[3] : null},
                            {personalisasi_id: 5}
                        ]
                        },
                        
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepId){
            const data = await resep.findAll({
                attributes: ['id', 'nama_resep', 'image'],
                where: {
                    [Op.or]: resepId
                },
                include:
                {
                    model: resep_personalisasi,
                    include: [
                        {
                            model: personalisasi
                        }
                    ]
                }
                // include: [
                //     {
                //         model: bahan,
                //         include: [
                //             {
                //                 model: tagbahan
                //             }
                //         ]
                //     },
                //     {
                //         model: resep_alatmasak,
                //         include: [
                //             {
                //                 model: alatmasak
                //             }
                //         ]
                //     },
                //     {
                //         model: resep_personalisasi,
                //         include: [
                //             {
                //                 model: personalisasi
                //             }
                //         ],
                //     }
                // ]
            })
            // const hasilJSON = JSON.parse(JSON.stringify(data));
            // hasilJSON.forEach(resepItem => {
            //     resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
            //     resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
            //     //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
            //   });
          
              res.status(200).json(data);
        }
        else if (resepDetailId){
            const data = await resep.findAll({
                where: {
                    [Op.or]: resepDetailId
                },
                include:
                {
                    model: resep_personalisasi,
                    include: [
                        {
                            model: personalisasi
                        }
                    ]
                },
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else if (resepByBahan){
            const data = await resep.findAll({
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan,
                            },
                        ],
                        where: {
                            [Op.or]: resepByBahan
                        }
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ],
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                //resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
        else {
            const data = await resep.findAll({
                include: [
                    {
                        model: bahan,
                        include: [
                            {
                                model: tagbahan
                            }
                        ]
                    },
                    {
                        model: resep_alatmasak,
                        include: [
                            {
                                model: alatmasak
                            }
                        ]
                    },
                    {
                        model: resep_personalisasi,
                        include: [
                            {
                                model: personalisasi
                            }
                        ]
                    }
                ]
            })
            const hasilJSON = JSON.parse(JSON.stringify(data));
            
            hasilJSON.forEach(resepItem => {
                resepItem.langkah_masak = resepItem.langkah_masak.split(/\d+\. /).slice(1);
                resepItem.image_steps = resepItem.image_steps.split(/\d+\. /).slice(1);
                // resepItem.image_steps = resepItem.image_steps ? resepItem.image_steps.split(', ') : [];
              });
          
              res.status(200).json(hasilJSON);
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('/bahan', async (req, res) => {
const data = await tagbahan.findAll()
res.status(200).json(data)
})

app.get('/home', async (req, res) => {
    let ids
    if (req.query.ids) {
        arr = req.query.ids.split(',')

        ids = arr.map((el) => {
            return {id: Number(el)}
        })
    }

    // let resepId
    // if (req.query.resepId) {
    //     arr = req.query.resepId.split(',')

    //     resepId = arr.map((el) => {
    //         return {id: Number(el)}
    //     })
    // }

    const data = await resep.findAll({
        attributes: ['id', 'nama_resep', 'image'],
        where: {
            [Op.or]: ids
        },

        // const data = await resep.findAll({
        //     where: {
        //         [Op.or]: resepId
        //     },
        include:
        {
            model: resep_personalisasi,
            include: [
                {
                    model: personalisasi
                }
            ]
        }
      });
res.status(200).json(data)
})



app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
})