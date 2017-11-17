export const elasticResponseMock = {
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "failed": 0
    },
    "hits": {
        "total": 1,
        "max_score": 1.0,
        "hits": [
            {
                "_index": "article",
                "_type": "article_type",
                "_id": "articleId=TN-803839",
                "_score": 1.0,
                "_source": {
                    "content": {
                        "body": "texto loco del body",
                        "title": {
                            "headline": "Nicol\u00e1s V\u00e1zquez revel\u00f3 detalles de la enfermedad que sufr\u00eda su hermano: \"Que haya tenido la vida que tuvo es un milagro\"",
                            "main": "Nicol\u00e1s V\u00e1zquez revel\u00f3 detalles de la enfermedad que sufr\u00eda su hermano: \"Que haya tenido la vida que tuvo es un milagro\"",
                            "social": "Nicol\u00e1s V\u00e1zquez revel\u00f3 detalles de la enfermedad que sufr\u00eda su hermano: \"Que haya tenido la vida que tuvo es un milagro\""
                        },
                        "media": [
                            "/media/TN-kaltura-803838", "/media/TN-image-1054721"
                        ],
                        "createdISO": "20170703T003031-0300",
                        "changedISO": "20170703T003031-0300",
                        "dropline": "texto loco del dropline",
                        "tagList": [
                            { "machineName": "murio-santiago-vazquez", "name": "muri\u00f3 Santiago Vazquez" }
                        ]
                    },
                    "body": [
                        {
                            "content": "{\"entityMap\":{\"0\":{\"type\":\"PEOPLE_LINK\",\"mutability\":\"INMUTABLE\",\"data\":{\"type\":\"people\",\"url\":\"http:\\/\\/tn.com.ar\\/personajes\\/nicol\\u00e1s-v\\u00e1zquez\"}}},\"blocks\":[{\"key\":\"7gj4j\",\"text\":\"Nicol\\u00e1s V\\u00e1zquez estuvo junto a Gimena Accardi en el living de Susana Gim\\u00e9nez y habl\\u00f3 largo y tendido sobre el duro momento que atraves\\u00f3 junto a su familia por la muerte de su hermano, Santiago.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":162,\"length\":30,\"style\":\"BOLD\"}],\"entityRanges\":[{\"offset\":0,\"length\":15,\"key\":0}],\"data\":{}},{\"key\":\"cnbnq\",\"text\":\"Recordemos que el actor muri\\u00f3 el a\\u00f1o pasado, en medio de un viaje con amigos a Punta Cana. Tiempo despu\\u00e9s se supo que el hecho se produjo por una enfermedad cong\\u00e9nita, una miocardiopat\\u00eda hipertr\\u00f3fica.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"26noh\",\"text\":\"\\\"Cuando lleg\\u00f3 la autopsia empezamos a entender de otro lugar. Era tan grande lo que ten\\u00eda San que pod\\u00eda haber vivido hasta los 6 a\\u00f1os. Pod\\u00eda haber ido a un trasplante s\\u00ed o s\\u00ed porque ten\\u00eda un coraz\\u00f3n de un hombre de 85 a\\u00f1os\\\", indic\\u00f3 Nico. Y agreg\\u00f3: \\\"Nos dijeron, 'que haya tenido la vida que tuvo es un milagro'\\\".\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":248,\"length\":63,\"style\":\"BOLD\"}],\"entityRanges\":[],\"data\":{}},{\"key\":\"b1m3f\",\"text\":\"Cont\\u00f3 que la noche anterior a la muerte hab\\u00eda hablado con \\u00e9l hasta las 3 de la ma\\u00f1ana porque River hab\\u00eda salido campe\\u00f3n. \\\"Fue a brindar con los amigos despu\\u00e9s. Al otro d\\u00eda se levanta, me pone me gusta a un par de fotos del casamiento, nos hab\\u00edamos casado hac\\u00eda 4 d\\u00edas. Fui al banco y vi que puso me gusta, le segu\\u00eda los movimientos\\\", relat\\u00f3. \\\"Estaba esperando para ir a desayunar con un amigo, se empez\\u00f3 a sentir mal... Y nos cambi\\u00f3 la vida para siempre\\\", lament\\u00f3.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"6u8g\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"ck25h\",\"text\":\"\",\"type\":\"atomic\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{\"type\":\"relatedtag\",\"dataType\":\"relatedtag\",\"data\":{\"tag\":{\"name\":\"muri\\u00f3 Santiago Vazquez\",\"url\":\"tags\\/murio-santiago-vazquez\"},\"articles\":[{\"nid\":\"798782\",\"url\":\"\\/show\\/basicas\\/nico-vazquez-hablo-por-primera-vez-de-su-hermano-y-emociono-todos-con-una-historia-con-su-papa_798782\",\"title\":\"Nico V\\u00e1zquez habl\\u00f3 por primera vez en vivo de su hermano y emocion\\u00f3 a todos con una historia con su pap\\u00e1\"},{\"nid\":\"784235\",\"url\":\"\\/show\\/basicas\\/gimena-accardi-revelo-el-verdadero-motivo-de-la-muerte-de-santi-vazquez_784235\",\"title\":\"Gimena Accardi revel\\u00f3 el verdadero motivo de la muerte de Santi V\\u00e1zquez\"},{\"nid\":\"783033\",\"url\":\"\\/show\\/basicas\\/hoy-santiago-vazquez-cumpliria-28-anos-y-su-mama-le-escribio-una-conmovedora-carta_783033\",\"title\":\"Hoy Santiago V\\u00e1zquez cumplir\\u00eda 28 a\\u00f1os y su mam\\u00e1 le escribi\\u00f3 una conmovedora carta\"}]}}},{\"key\":\"a2u93\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"8979u\",\"text\":\"\\\"Hoy, tratando de entender que si bien es una fatalidad, no es una desgracia. Es perder un ser querido que lo vas a extra\\u00f1ar todos los d\\u00edas. Todo puede cambiar en un segundo. No es una desgracia, todos los d\\u00edas te encontr\\u00e1s con desgracias de gente que no muere de esta manera, como los chicos de Mendoza\\\", coment\\u00f3 Nico. \\\"No s\\u00f3lo es el dolor de no verlos m\\u00e1s sino tambi\\u00e9n entender por qu\\u00e9 de esa manera\\\", continu\\u00f3.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":57,\"length\":19,\"style\":\"BOLD\"}],\"entityRanges\":[],\"data\":{}},{\"key\":\"99q3\",\"text\":\"Y coment\\u00f3: \\\"Nunca vas a enender c\\u00f3mo un chico de 27 a\\u00f1os se apaga de un d\\u00eda para el otro. Si no hubiera sido tan sano no hubiera vivido tanto\\\".\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":90,\"length\":51,\"style\":\"BOLD\"}],\"entityRanges\":[],\"data\":{}},{\"key\":\"f98o2\",\"text\":\"Cont\\u00f3 tambi\\u00e9n que \\u00e9l y su familia se tuvieron que hacer estudios para comprobar que estaban bien del coraz\\u00f3n, ya que la enfermedad que padec\\u00eda Santiago pod\\u00eda ser hereditaria. \\\"Si mi hermano se hubiera enterado le habr\\u00eda sido muy dif\\u00edcil\\\", dijo. Y explic\\u00f3 que lo \\u00fanico que detecta esa condici\\u00f3n es un ecocardiograma.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"5tm8t\",\"text\":\"Nico revel\\u00f3 c\\u00f3mo se enteraron sus padres. Fue \\u00e9l el encargado de decirles. Estaba muy nervioso porque no quer\\u00eda que se enteraran por otros medios.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"64pj7\",\"text\":\"\\\"A m\\u00ed me salv\\u00f3 estar trabajando\\\", dijo luego. Y agreg\\u00f3: \\\"Al p\\u00fablico le debo todo, pero desde antes\\\".\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}]}",
                            "type": "draft"
                        }],
                    "dropline": [
                        {
                            "content": "{\"entityMap\":{},\"blocks\":[{\"key\":\"br6mi\",\"text\":\"La autopsia mostr\\u00f3 datos que nadie conoc\\u00eda sobre la salud de Santiago V\\u00e1zquez.\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}]}",
                            "type": "draft"
                        }
                    ],
                    "@timestamp": "2017-11-08T14:58:06.288568",
                    "articleId": "TN-803839",
                    "@SequenceNumber": "786471700000000011465536748"
                }
            }
        ]
    }
};
