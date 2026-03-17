let inventoryModel = require('../schemas/inventory');

module.exports = {
    getAll: async (req, res) => {
        try {
            let result = await inventoryModel.find().populate('product');
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            let result = await inventoryModel.findById(req.params.id).populate('product');
            if (result) {
                res.send(result);
            } else {
                res.status(404).send({ message: "Không tìm thấy kho hàng" });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    addStock: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            let result = await inventoryModel.findOneAndUpdate(
                { product: product },
                { $inc: { stock: quantity } },
                { new: true }
            );
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    removeStock: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            let inventory = await inventoryModel.findOne({ product: product });
            if (!inventory || inventory.stock < quantity) {
                return res.status(400).send({ message: "Số lượng tồn kho không đủ" });
            }
            inventory.stock -= quantity;
            await inventory.save();
            res.send(inventory);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    reservation: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            let inventory = await inventoryModel.findOne({ product: product });
            if (!inventory || inventory.stock < quantity) {
                return res.status(400).send({ message: "Số lượng tồn kho không đủ để giữ hàng" });
            }
            inventory.stock -= quantity;
            inventory.reserved += quantity;
            await inventory.save();
            res.send(inventory);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    sold: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            let inventory = await inventoryModel.findOne({ product: product });
            if (!inventory || inventory.reserved < quantity) {
                return res.status(400).send({ message: "Số lượng giữ hàng không đủ để bán" });
            }
            inventory.reserved -= quantity;
            inventory.soldCount += quantity;
            await inventory.save();
            res.send(inventory);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
};
