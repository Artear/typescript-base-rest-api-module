import * as Joi from "joi";
import {ObjectSchema} from "joi";

const itemSchema: ObjectSchema = Joi.object().keys({
    itemId: Joi.string().regex(/^[a-z0-9\-]+$/i).min(2).max(40),
    content: Joi.object().keys({
        title: Joi.object().keys({
            main: Joi.string(),
            social: Joi.string(),
            headline: Joi.string()
        }),
        body: Joi.array().items(
            Joi.object().keys({
                type: Joi.string(),
                content: Joi.alternatives().when(
                    "type",
                    {
                        is: "gallery",
                        then: Joi.array().items(
                            Joi.string()
                        ),
                        otherwise: Joi.string()
                    }
                ),
            })
        ),
        media: Joi.array().items(
            Joi.string()
        ),
        createdISO: Joi.string().regex(/^[0-9]+T[0-9]+(Z|([-+][0-9]{4}))?$/),
        changedISO: Joi.string().regex(/^[0-9]+T[0-9]+(Z|([-+][0-9]{4}))?$/),
        tagList: Joi.array().items(
            Joi.object().keys({
                name: Joi.string(),
                machineName: Joi.string()
            })
        )
    })
});

export let itemSchemaPost = itemSchema.requiredKeys("content");
export let itemSchemaUpdate = itemSchema.requiredKeys("content", "itemId");