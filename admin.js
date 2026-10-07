const SUPABASE_URL =
  "https://jjdydaleaiyhjshxklcc.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_0Y1X_KVqsUl_xrru5R4b5Q_7okhk9Te";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* =========================
   ELEMENTS
========================= */

const loginPage =
  document.getElementById("loginPage");

const adminPage =
  document.getElementById("adminPage");

const emailInput =
  document.getElementById("email");

const passwordInput =
  document.getElementById("password");

const loginButton =
  document.getElementById("loginButton");

const loginMessage =
  document.getElementById("loginMessage");

const logoutButton =
  document.getElementById("logoutButton");


/* =========================
   LOGIN
========================= */

loginButton.addEventListener(
  "click",
  login
);


async function login() {

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  if (!email || !password) {

    loginMessage.textContent =
      "Email and password দিন।";

    return;
  }

  loginButton.disabled = true;

  loginMessage.textContent =
    "Logging in...";


  const { data, error } =
    await db.auth.signInWithPassword({

      email: email,
      password: password

    });


  loginButton.disabled = false;


  if (error) {

    loginMessage.textContent =
      "Login failed: " +
      error.message;

    return;
  }


  openAdmin();
}


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(
  "click",
  async function () {

    await db.auth.signOut();

    adminPage.classList.add("hidden");

    loginPage.classList.remove("hidden");

  }
);


/* =========================
   OPEN ADMIN
========================= */

function openAdmin() {

  loginPage.classList.add("hidden");

  adminPage.classList.remove("hidden");

  loadDashboard();

  loadProducts();

  loadOrders();
}


/* =========================
   CHECK SESSION
========================= */

async function checkSession() {

  const { data } =
    await db.auth.getSession();

  if (data.session) {

    openAdmin();

  }

}


/* =========================
   NAVIGATION
========================= */

document
  .querySelectorAll(".navButton")
  .forEach(function(button) {

    button.addEventListener(
      "click",
      function() {

        const tabName =
          button.dataset.tab;


        document
          .querySelectorAll(".navButton")
          .forEach(function(btn) {

            btn.classList.remove(
              "active"
            );

          });


        document
          .querySelectorAll(".tab")
          .forEach(function(tab) {

            tab.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        document
          .getElementById(tabName)
          .classList.add("active");

      }
    );

  });


/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {

  const productResult =
    await db
      .from("products")
      .select("*", {
        count: "exact",
        head: true
      });


  const orderResult =
    await db
      .from("orders")
      .select("*", {
        count: "exact",
        head: true
      });


  document.getElementById(
    "productCount"
  ).textContent =
    productResult.count || 0;


  document.getElementById(
    "orderCount"
  ).textContent =
    orderResult.count || 0;

}


/* =========================
   PRODUCT FORM
========================= */

const addProductButton =
  document.getElementById(
    "addProductButton"
  );

const cancelProductButton =
  document.getElementById(
    "cancelProductButton"
  );

const productForm =
  document.getElementById(
    "productForm"
  );


addProductButton.addEventListener(
  "click",
  function() {

    resetForm();

    productForm.classList.remove(
      "hidden"
    );

  }
);


cancelProductButton.addEventListener(
  "click",
  function() {

    productForm.classList.add(
      "hidden"
    );

  }
);


function resetForm() {

  document.getElementById(
    "formTitle"
  ).textContent =
    "Add Product";


  document.getElementById(
    "editProductId"
  ).value = "";


  document.getElementById(
    "productName"
  ).value = "";


  document.getElementById(
    "productSubcategory"
  ).value = "";


  document.getElementById(
    "productPrice"
  ).value = "";


  document.getElementById(
    "productOldPrice"
  ).value = "";


  document.getElementById(
    "productStock"
  ).value = "";


  document.getElementById(
    "productBadge"
  ).value = "";


  document.getElementById(
    "productDescription"
  ).value = "";


  document.getElementById(
    "productImage"
  ).value = "";


  const preview =
    document.getElementById(
      "imagePreview"
    );


  preview.src = "";

  preview.classList.add(
    "hidden"
  );

}


/* =========================
   IMAGE PREVIEW
========================= */

document
  .getElementById("productImage")
  .addEventListener(
    "change",
    function() {

      const file =
        this.files[0];

      if (!file) return;


      const preview =
        document.getElementById(
          "imagePreview"
        );


      preview.src =
        URL.createObjectURL(file);


      preview.classList.remove(
        "hidden"
      );

    }
  );


/* =========================
   SAVE PRODUCT
========================= */

document
  .getElementById(
    "saveProductButton"
  )
  .addEventListener(
    "click",
    saveProduct
  );


async function saveProduct() {

  const message =
    document.getElementById(
      "productMessage"
    );


  message.textContent =
    "Saving...";


  const id =
    document.getElementById(
      "editProductId"
    ).value;


  const name =
    document.getElementById(
      "productName"
    ).value.trim();


  const category =
    document.getElementById(
      "productCategory"
    ).value;


  const subcategory =
    document.getElementById(
      "productSubcategory"
    ).value.trim();


  const price =
    Number(
      document.getElementById(
        "productPrice"
      ).value
    );


  const oldPriceValue =
    document.getElementById(
      "productOldPrice"
    ).value;


  const oldPrice =
    oldPriceValue
      ? Number(oldPriceValue)
      : null;


  const stock =
    Number(
      document.getElementById(
        "productStock"
      ).value
    ) || 0;


  const badge =
    document.getElementById(
      "productBadge"
    ).value.trim();


  const description =
    document.getElementById(
      "productDescription"
    ).value.trim();


  if (!name || !price) {

    message.textContent =
      "Product name এবং price দিন।";

    return;
  }


  /* GET EXISTING IMAGE */

  let image = null;


  if (id) {

    const { data } =
      await db
        .from("products")
        .select("image")
        .eq("id", id)
        .single();


    if (data) {

      image =
        data.image || null;

    }

  }


  /* UPLOAD IMAGE */

  const file =
    document.getElementById(
      "productImage"
    ).files[0];


  if (file) {

    const extension =
      file.name
        .split(".")
        .pop()
        .toLowerCase();


    const fileName =
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .substring(2) +
      "." +
      extension;


    const filePath =
      "products/" +
      fileName;


    const { error } =
      await db.storage
        .from("product-images")
        .upload(
          filePath,
          file
        );


    if (error) {

      message.textContent =
        "Image upload error: " +
        error.message;

      return;
    }


    const publicURL =
      db.storage
        .from("product-images")
        .getPublicUrl(
          filePath
        );


    image =
      publicURL.data.publicUrl;

  }


  /* PRODUCT DATA */

  const productData = {

    name: name,

    category: category,

    subcategory: subcategory,

    price: price,

    old_price: oldPrice,

    stock: stock,

    rating: 5,

    badge: badge,

    image: image,

    description: description

  };


  let result;


  /* EDIT */

  if (id) {

    result =
      await db
        .from("products")
        .update(productData)
        .eq("id", id);

  }

  /* NEW */

  else {

    result =
      await db
        .from("products")
        .insert(
          productData
        );

  }


  if (result.error) {

    message.textContent =
      result.error.message;

    return;
  }


  message.textContent =
    "Product saved.";


  productForm.classList.add(
    "hidden"
  );


  resetForm();


  loadProducts();

  loadDashboard();

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  const container =
    document.getElementById(
      "productsList"
    );


  container.innerHTML =
    "<p>Loading...</p>";


  const { data, error } =
    await db
      .from("products")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    container.innerHTML =
      "<p>" +
      error.message +
      "</p>";

    return;
  }


  if (!data.length) {

    container.innerHTML =
      "<p>No products found.</p>";

    return;
  }


  container.innerHTML =
    data
      .map(function(product) {

        const image =
          product.image ||
          "https://via.placeholder.com/500";


        return `

          <div class="product-card">

            <img
              src="${image}"
              alt="${product.name}"
            >

            <div class="product-content">

              <h3>
                ${product.name}
              </h3>

              <p>
                ${product.category}
              </p>

              <p>
                <b>${product.price} SAR</b>
              </p>

              <p>
                Stock:
                ${product.stock || 0}
              </p>

              <div class="product-actions">

                <button
                  class="edit"
                  onclick="editProduct('${product.id}')"
                >
                  Edit
                </button>

                <button
                  class="delete"
                  onclick="deleteProduct('${product.id}')"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        `;

      })
      .join("");

}


/* =========================
   EDIT
========================= */

async function editProduct(id) {

  const { data, error } =
    await db
      .from("products")
      .select("*")
      .eq("id", id)
      .single();


  if (error) {

    alert(error.message);

    return;
  }


  document
    .querySelector(
      '[data-tab="products"]'
    )
    .click();


  productForm.classList.remove(
    "hidden"
  );


  document.getElementById(
    "formTitle"
  ).textContent =
    "Edit Product";


  document.getElementById(
    "editProductId"
  ).value =
    data.id;


  document.getElementById(
    "productName"
  ).value =
    data.name || "";


  document.getElementById(
    "productCategory"
  ).value =
    data.category || "Shoes";


  document.getElementById(
    "productSubcategory"
  ).value =
    data.subcategory || "";


  document.getElementById(
    "productPrice"
  ).value =
    data.price || "";


  document.getElementById(
    "productOldPrice"
  ).value =
    data.old_price || "";


  document.getElementById(
    "productStock"
  ).value =
    data.stock || "";


  document.getElementById(
    "productBadge"
  ).value =
    data.badge || "";


  document.getElementById(
    "productDescription"
  ).value =
    data.description || "";


  if (data.image) {

    const preview =
      document.getElementById(
        "imagePreview"
      );


    preview.src =
      data.image;


    preview.classList.remove(
      "hidden"
    );

  }

}


/* =========================
   DELETE
========================= */

async function deleteProduct(id) {

  const confirmed =
    confirm(
      "এই product টি delete করবেন?"
    );


  if (!confirmed) return;


  const { error } =
    await db
      .from("products")
      .delete()
      .eq("id", id);


  if (error) {

    alert(error.message);

    return;
  }


  loadProducts();

  loadDashboard();

}


/* =========================
   ORDERS
========================= */

async function loadOrders() {

  const container =
    document.getElementById(
      "ordersList"
    );


  const { data, error } =
    await db
      .from("orders")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    container.innerHTML =
      "<p>" +
      error.message +
      "</p>";

    return;
  }


  if (!data.length) {

    container.innerHTML =
      "<p>No orders yet.</p>";

    return;
  }


  container.innerHTML =
    data
      .map(function(order) {

        return `

          <div class="order-card">

            <p>
              <b>Customer:</b>
              ${order.customer_name || ""}
            </p>

            <p>
              <b>Phone:</b>
              ${order.phone || ""}
            </p>

            <p>
              <b>Address:</b>
              ${order.address || ""}
            </p>

            <p>
              <b>Total:</b>
              ${order.total || 0} SAR
            </p>

            <p>
              <b>Status:</b>
              ${order.status || "Pending"}
            </p>

          </div>

        `;

      })
      .join("");

}


/* =========================
   START
========================= */

checkSession();
