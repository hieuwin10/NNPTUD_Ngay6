let mongoose = require('mongoose');

let inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, "Sản phẩm là bắt buộc"],
        unique: [true, "Mỗi sản phẩm chỉ có một bản ghi kho hàng"]
    },
    stock: {
        type: Number,
        min: [0, "Số lượng tồn kho không được nhỏ hơn 0"],
        default: 0
    },
    reserved: {
        type: Number,
        min: [0, "Số lượng giữ hàng không được nhỏ hơn 0"],
        default: 0
    },
    soldCount: {
        type: Number,
        min: [0, "Số lượng đã bán không được nhỏ hơn 0"],
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('inventory', inventorySchema);
