import crypto from 'crypto';

const signUp = async (req,res) => {
  console.log(req.body);
  res.status(200).json({
    message : "success "
  })
}