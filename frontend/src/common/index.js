const backendDomin = "https://8080-majeduldev-ecom-dxiwo2blvmm.ws-us117.gitpod.io"

const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/product/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/product/update-product`,
        method  : 'post'
    },
    categoryProduct : {
        url : `${backendDomin}/api/product/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/product/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/product/product-details`,
        method : 'get'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/filter-product`,
        method : 'post'
    }
}


export default SummaryApi