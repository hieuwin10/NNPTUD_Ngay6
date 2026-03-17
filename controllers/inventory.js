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
            if (!product || !quantity || quantity <= 0) {
                return res.status(400).send({ message: "Dữ liệu không hợp lệ" });
            }
            let result = await inventoryModel.findOneAndUpdate(
                { product: product },
                { $inc: { stock: quantity } },
                { new: true }
            ).populate('product');
            if (!result) return res.status(404).send({ message: "Không tìm thấy sản phẩm trong kho" });
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    removeStock: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            if (!product || !quantity || quantity <= 0) {
                return res.status(400).send({ message: "Dữ liệu không hợp lệ" });
            }
            // Kiểm tra stock trước khi giảm
            let inventory = await inventoryModel.findOne({ product: product });
            if (!inventory || inventory.stock < quantity) {
                return res.status(400).send({ message: "Số lượng tồn kho không đủ" });
            }

            let result = await inventoryModel.findOneAndUpdate(
                { product: product, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } },
                { new: true }
            ).populate('product');
            
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    reservation: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            if (!product || !quantity || quantity <= 0) {
                return res.status(400).send({ message: "Dữ liệu không hợp lệ" });
            }
            
            let result = await inventoryModel.findOneAndUpdate(
                { product: product, stock: { $gte: quantity } },
                { $inc: { stock: -quantity, reserved: quantity } },
                { new: true }
            ).populate('product');

            if (!result) {
                return res.status(400).send({ message: "Số lượng tồn kho không đủ để giữ hàng" });
            }
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    sold: async (req, res) => {
        try {
            const { product, quantity } = req.body;
            if (!product || !quantity || quantity <= 0) {
                return res.status(400).send({ message: "Dữ liệu không hợp lệ" });
            }

            let result = await inventoryModel.findOneAndUpdate(
                { product: product, reserved: { $gte: quantity } },
                { $inc: { reserved: -quantity, soldCount: quantity } },
                { new: true }
            ).populate('product');

            if (!result) {
                return res.status(400).send({ message: "Số lượng giữ hàng không đủ để bán" });
            }
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
};
