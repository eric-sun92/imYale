exports.homeTest = async (req, res) => {
    return res.status(200).json({
        message: "Server running"
    });
}