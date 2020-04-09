import { V0MODELS } from '../controllers/v0/models'
import { sequelize } from '../sequelize'
;(async (): Promise<void> => {
  await sequelize.addModels(V0MODELS)
  await sequelize.sync()
})()
